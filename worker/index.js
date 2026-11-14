// Lleva cualquier dirección antigua (www.gxdgarage.cl o la de workers.dev)
// a https://gxdgarage.cl con la misma ruta, para que Google y los enlaces
// compartidos usen una sola dirección. Todo lo demás se sirve tal cual desde dist.
const DOMINIO = "gxdgarage.cl";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname !== DOMINIO) {
      url.hostname = DOMINIO;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
