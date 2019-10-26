function logger (prefix = null) {
  const fn = function () {
    if (process.env.DEBUG !== 'true') return;
    arguments[0] = '  ' + (prefix ? prefix + ':' : '') + arguments[0];
    console.log.apply(console, arguments);
  };
  fn.prefix = logger;
  return fn;
}

module.exports = logger();
