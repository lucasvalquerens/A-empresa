const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const HANDLE = process.env.INFINITEPAY_HANDLE || "lucas-reis-dos-santos06";
const PUBLIC_URL = process.env.PUBLIC_URL || "";

const products = {
  "moletom-preto": { name: "Moletom A EMPRESA", price: 9500 },
  "moletom-verde": { name: "Moletom Forest", price: 9500 },
  "camiseta-world": { name: "Camiseta The World Is Yours", price: 6000 },
  "camiseta-frente-verso": { name: "Camiseta World Is Yours — Frente e Verso", price: 6500 }
};

function send(res, status, data, type="application/json") {
  res.writeHead(status, {"Content-Type": type, "Access-Control-Allow-Origin": "*"});
  res.end(type === "application/json" ? JSON.stringify(data) : data);
}
function getBody(req) {
  return new Promise((resolve,reject)=>{
    let body="";
    req.on("data", c=>body+=c);
    req.on("end", ()=>{ try{ resolve(body ? JSON.parse(body) : {}); }catch(e){reject(e);} });
  });
}

const server=http.createServer(async (req,res)=>{
  if(req.method==="OPTIONS"){
    res.writeHead(204, {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type"});
    return res.end();
  }

  if(req.method==="POST" && req.url==="/api/checkout"){
    try{
      const body=await getBody(req);
      const p=products[body.productId];
      if(!p) return send(res,400,{error:"Produto não encontrado."});
      const order_nsu = "AE-" + Date.now() + "-" + crypto.randomBytes(3).toString("hex");
      const baseUrl = PUBLIC_URL || `http://localhost:${PORT}`;
      const payload = {
        handle: HANDLE,
        redirect_url: `${baseUrl}/obrigado.html`,
        order_nsu,
        items: [{quantity:1, price:p.price, description:p.name}]
      };
      const r=await fetch("https://api.checkout.infinitepay.io/links",{
        method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
      });
      const data=await r.json();
      if(!r.ok || !data.url) return send(res,502,{error:"A InfinitePay não criou o checkout.",details:data});
      return send(res,200,{url:data.url});
    }catch(e){ return send(res,500,{error:"Erro ao criar checkout.",details:e.message}); }
  }

  let file = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  if(file === "/obrigado.html"){
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedido recebido | A EMPRESA</title><style>body{font-family:Arial;background:#0b0b0b;color:#fff;display:grid;place-items:center;min-height:100vh;text-align:center;padding:25px}.box{max-width:600px}a{display:inline-block;margin-top:22px;padding:14px 22px;background:#fff;color:#111;text-decoration:none;border-radius:5px;font-weight:800}</style></head><body><div class="box"><h1>Obrigado pela compra!</h1><p>Seu pagamento foi encaminhado pela InfinitePay. Guarde o comprovante.</p><a href="/">Voltar para a loja</a></div></body></html>`;
    return send(res,200,html,"text/html; charset=utf-8");
  }
  const filePath=path.join(__dirname,file);
  if(!filePath.startsWith(__dirname) || !fs.existsSync(filePath)) return send(res,404,{error:"Página não encontrada."});
  const ext=path.extname(filePath).toLowerCase();
  const types={".html":"text/html; charset=utf-8",".jpeg":"image/jpeg",".jpg":"image/jpeg",".png":"image/png",".css":"text/css",".js":"text/javascript"};
  send(res,200,fs.readFileSync(filePath),types[ext]||"application/octet-stream");
});
server.listen(PORT,()=>console.log(`A EMPRESA rodando na porta ${PORT}`));