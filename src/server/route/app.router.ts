import { createRouter } from "../createRouter";

export const appRouter = createRouter().query("hello", {
    resolve: ()  => {
        return "hello world";
    },
});

export type AppRouter = typeof appRouter;