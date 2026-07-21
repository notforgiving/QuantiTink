export default async function handler(req: any, res: any) {
  try {
    console.log("Function started");

    console.log("Token exists:", !!process.env.TBANK_TOKEN);

    const response = await fetch(
      "https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TBANK_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const text = await response.text();

    console.log("Status:", response.status);

    return res.status(200).json({
      status: response.status,
      body: text,
    });
  } catch (e: any) {
    console.error("ERROR:", e);
    console.error("CAUSE:", e?.cause);

    return res.status(500).json({
      message: e?.message,
      cause: e?.cause,
      stack: e?.stack,
    });
  }
}