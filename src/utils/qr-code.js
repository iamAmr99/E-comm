import qrcode from 'qrcode';


export const qrCodeGenetation = async (data)=>{
   const generatedQrCode = await  qrcode.toDataURL(JSON.stringify(data) , 
    { errorCorrectionLevel: 'H' })
    return generatedQrCode
}

// error correction level: 'H'

// break 11:50 

// delpoyment => hosts => render, heroku, netlify, vercel, aws, azure, digital ocean, firebase, github pages, surge, now, render, google cloud,