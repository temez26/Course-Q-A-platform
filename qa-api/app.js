import { serve } from "./deps.js";
import { urlMapping } from "./urlMapping.js";
const handleRequest = async (request) => {
  try {
    const mapping = urlMapping.find(
      (um) => um.method === request.method && um.pattern.test(request.url)
    );
    if (!mapping) {
      return new Response("Not found", { status: 404 });
    }
    const mappingResult = mapping.pattern.exec(request.url);
    return await mapping.fn(request, mappingResult);
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
};
const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
