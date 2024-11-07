export async function POST(request, response) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const url = formData.get('url');

    // test error
    if (!file || !url) throw new Error('Missing File or URL from formdata');

    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Error', error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}