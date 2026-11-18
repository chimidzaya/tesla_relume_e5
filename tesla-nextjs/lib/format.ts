/** 3000000 → «3,000,000₮» */
export const formatMNT = (amount: number) => `${Math.round(amount).toLocaleString("en-US")}₮`;
