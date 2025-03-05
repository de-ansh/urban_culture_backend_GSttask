import axios from "axios";

const GST_API_URL = "https://my.gstzen.in/~gstzen/a/post-einvoice-data/einvoice-json/"; // Replace with actual API

export const sendGSTInvoice = async ({
    totalAmount,
    totalGST,
    cgst,
    sgst,
    userData,
    companyData,
}: any) => {
    try {
        const gstRequestBody = {
            Version: "1.1",
            TranDtls: {
                TaxSch: "GST",
                SupTyp: "B2B",
                RegRev: "N",
                IgstOnIntra: "N",
            },
            DocDtls: {
                Typ: "INV",
                No: `GST-Invoice-rt`,
                Dt: new Date().toISOString().split("T")[0],
            },
            SellerDtls: {
                Gstin: "29AADCG4992P1ZP",
                LglNm: companyData.name,
                Addr1: companyData.address,
                Loc: "Bangalore", // You may want to fetch actual location from Firestore
                Pin: 560077,
                Stcd: "29", // Get actual state code from Firestore
            },
            BuyerDtls: {
                Gstin: "06AAMCS8709B1ZA",

                LglNm: userData.name,
                Addr1: userData.address,
                Loc: "User Location", // Add user location if stored in Firestore
                Pin: 121009, // Replace with actual user PIN if available
                Stcd: "06", // Replace with actual user state code
            },
            ItemList: [
                {
                    ItemNo: 1,
                    SlNo: "1",
                    PrdDesc: "Service Booking",
                    HsnCd: "998599", // Use correct HSN code for service
                    Qty: 1,
                    Unit: "NOS",
                    UnitPrice: totalAmount,
                    TotAmt: totalAmount,
                    GstRt: 18,
                    CgstAmt: cgst,
                    SgstAmt: sgst,
                    TotItemVal: totalAmount + totalGST,
                },
            ],
            ValDtls: {
                AssVal: totalAmount,
                CgstVal: cgst,
                SgstVal: sgst,
                TotInvVal: totalAmount + totalGST,
            },
        };

        const response = await axios.post(GST_API_URL, gstRequestBody, {
            headers: {
                Token: "de3a3a01-273a-4a81-8b75-13fe37f14dc6",
                "Content-Type": "application/json",
            },
        });

        console.log("GST API Response:", response.data);
    } catch (error) {
        console.error("Error sending GST invoice:", error);
    }
};
