var bigInt = require("big-integer");

// Cache en memoria: vive solo mientras esta instancia siga en ejecucion
const memo = { 0: bigInt.zero, 1: bigInt.one };

function fib(n) {
    if (memo[n] !== undefined) return memo[n];
    memo[n] = fib(n - 1).add(fib(n - 2));
    return memo[n];
}

module.exports = async function (context, req) {
    const nth = req.body.nth;
    if (nth < 0) throw "must be greater than 0";

    const cached = memo[nth] !== undefined;
    const t0 = Date.now();
    const answer = fib(nth).toString();

    context.res = {
        body: {
            nth: nth,
            cached: cached,
            ms: Date.now() - t0,
            cacheSize: Object.keys(memo).length,
            uptimeSeconds: Math.round(process.uptime()),
            instance: (process.env.WEBSITE_INSTANCE_ID || "local").slice(0, 8),
            digits: answer.length,
            value: answer.slice(0, 20) + "..."
        }
    };
};
