export const prerender = false;

export async function POST({ request }) {

  try {

    const data = await request.formData();

    const contributor = data.get("contributor");
    const course = data.get("course");
    const year = data.get("year");
    const subject = data.get("subject");
    const examType = data.get("examType");

    const response = await fetch(
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
Contributor: ${contributor}

Course: ${course}

Year: ${year}

Exam Type: ${examType}
          `,
        }),
      }
    );

    return new Response(
      JSON.stringify({
        success: response.ok,
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