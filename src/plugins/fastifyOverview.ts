import { writeFile } from "fs";
import { resolve } from "path";
import FastifyOverview, { type FastifyOverviewOptions } from "fastify-overview";
import fp from "fastify-plugin";

/**
 * This plugins adds fastify-overview
 * It gives you a tree structure to understand all the relations between your routes and plugins.
 *
 * @see https://github.com/Eomm/fastify-overview
 */
export default fp<FastifyOverviewOptions>(
  async (fastify, opts: FastifyOverviewOptions) => {
    const exposeRoutePath = "/json-overview";

    const defaultOpts = {
      addSource: true, // is current throw error and stoped the app startup
      exposeRoute: true,
      exposeRouteOptions: {
        url: exposeRoutePath,
      },
    };

    await fastify.register(FastifyOverview, { ...defaultOpts, ...opts });
    fastify.log.info("Fastify overview tree structure plugin enabled.");
    fastify.log.info(`The route is exposed at GET ${exposeRoutePath}`);

    fastify.addHook("onReady", (done) => {
      fastify.log.info("Fastify overview, Hook: onReady invoked!");

      const appStructure = fastify.overview({
        // hideEmpty: false
      });

      writeFile(
        resolve(process.cwd(), "out/fastify_overview.json"),
        JSON.stringify(appStructure, null, 2),
        (err) => {
          if (err) {
            fastify.log.trace("Fastify overview onReady Error:", err);
            throw err;
          }
        }
      );
      done();
    });
  }
);
