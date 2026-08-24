import type {ExecResult, Logger} from '@oliveryasuna/ts-task';

/**
 * ctx.exec resolves rather than rejects Won a non-zero exit, so every command
 * needs an explicit check. Output is buffered, so it is only surfaced on
 * failure (otherwise a passing lint would dump its whole report).
 */
const sh = (async(
  ctx: {
    log: Logger;
    exec(c: string, a?: (readonly string[])): Promise<ExecResult>;
  },
  command: string,
  args: (readonly string[]) = []
): Promise<ExecResult> => {
  const result = (await ctx.exec(command, args));
  if(result.code !== 0) {
    if(result.stdout.trim()) {
      ctx.log.info(result.stdout.trimEnd());
    }
    if(result.stderr.trim()) {
      ctx.log.error(result.stderr.trimEnd());
    }

    throw (new Error(`${[command, ...args].join(' ')} exited ${result.code}`));
  }

  return result;
});

export {
  sh
};
