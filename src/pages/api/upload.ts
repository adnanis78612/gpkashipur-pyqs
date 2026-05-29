import { Buffer } from "buffer";

export async function POST({ request }) {
  try {
    // form data
    const data = await request.formData();

    const contributor = data.get("contributor");
    const course = data.get("course");
    const year = data.get("year");
    const subject = data.get("subject");
    const examType = data.get("examType");

    // pdf file
    const pdf = data.get("pdf");

    // validation
    if (!pdf || typeof pdf === "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No PDF uploaded",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // convert pdf to buffer
    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const fileName = `${Date.now()}-${pdf.name}`;

    // upload PDF to github repo pending folder
    const uploadResponse = await fetch(
      `https://api.github.com/repos/adnanis78612/gpkashipur-pyqs/contents/pending/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `uploaded ${fileName}`,
          content: buffer.toString("base64"),
        }),
      },
    );

    const uploadResult = await uploadResponse.json();

    // upload failed
    if (!uploadResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: uploadResult,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // github pdf url
    const fileUrl =
      `https://github.com/adnanis78612/gpkashipur-pyqs/blob/main/pending/${fileName}`;

    // issue body
    const issueBody = `
# New PYQ Upload

## Contributor
${contributor}

## Course
${course}

## Year
${year}

## Subject
${subject}

## Exam Type
${examType}

## PDF
${fileUrl}
`;

    // create github issue
    const issueResponse = await fetch(
      "https://api.github.com/repos/adnanis78612/gpkashipur-pyqs/issues",
      {
        method: "POST",
        headers: {
          Authorization: `token ${import.meta.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `PYQ Upload: ${subject}`,
          body: issueBody,
        }),
      },
    );

    const issueResult = await issueResponse.json();

    // issue failed
    if (!issueResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: issueResult,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // success
    return new Response(
      JSON.stringify({
        success: true,
        message: "PDF uploaded successfully",
        pdf: fileUrl,
        issue: issueResult.html_url,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}