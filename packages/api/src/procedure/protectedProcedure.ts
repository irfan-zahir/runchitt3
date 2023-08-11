import * as trpc from '@trpc/server'
import { t } from '../trpc'

/**
 * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
 */
const isProtected = t.middleware(async ({ ctx: { session, ...ctx }, next }) => {
    if (!session) {
        throw new trpc.TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next({
        ctx: {
            session,
            ...ctx,
            // infers that `session` is non-nullable to downstream resolvers
            // session: { ...ctx.session, user: ctx.session.user },
        },
    })
})

export const protectedProcedure = t.procedure.use(isProtected)
