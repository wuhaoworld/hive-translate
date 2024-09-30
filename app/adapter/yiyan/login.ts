'use server'
export async function login(apikey: string, secretkey: string) {
  const Loginurl = `https://aip.baidubce.com/oauth/2.0/token?client_id=${apikey}&client_secret=${secretkey}&grant_type=client_credentials`;
  const resp = await fetch(Loginurl).catch(() => {
    return new Response('{"error": true, "message": "input error"}', { status: 504, statusText: "input error" })
  }
  );
  const result = await resp.json();
  if (result.error) {
    return { error: true, message: `校验失败，API Key 或 Secret Key 错误` };
  } else {
    return result;
  }
}
