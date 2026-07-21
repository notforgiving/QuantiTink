export default async function handler(req: any, res: any) {
  try {
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

    return res.status(200).json({
      status: response.status,
      body: text,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message ?? String(error),
      stack: error?.stack,
    });
  }
}