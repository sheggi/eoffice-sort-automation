export function println() {
    arguments[0] = (process.env.DEBUG === 'true' ? '> ' : '  ') + arguments[0];
    console.log.apply(console, arguments);
}