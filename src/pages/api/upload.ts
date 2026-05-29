export const prerender = false;

export async function POST({ request }) {
  try {
    const data = await request.formData();

    const contributor = data.get("contributor");
    const course = data.get("course");
    const year = data.get("year");
    const subject = data.get("subject");
    const examType = data.get("examType");

    const pdf = data.get("pdf");

    if (!pdf || typeof pdf === "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "PDF not found",
        }),
        {
          status: 400,
        }
      );
    }

    const bytes = await pdf.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${pdf.name}`;

    // upload pdf to github
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
      }
    );

    const uploadResult = await uploadResponse.json();

    if (!uploadResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: uploadResult,
        }),
        {
          status: 500,
        }
      );
    }

    const fileUrl =
      `https://github.com/adnanis78612/gpkashipur-pyqs/blob/main/pending/${fileName}`;

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
          body: `
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
`,
        }),
      }
    );

    const issueResult = await issueResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        issue: issueResult.html_url,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
      }
    );
  }
}