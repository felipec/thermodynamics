function validNumber(n) {
  return n <= Number.MAX_VALUE && n >= -Number.MAX_VALUE;
}

/*
 * Implementation from CoolProp: http://coolprop.org/
 */
function brent(f, a, b, macheps, t, maxiter) {
  let iter;
  let fa, fb, c, fc, m, tol, d, e, p, q, s, r;
  fa = f(a);
  fb = f(b);

  // If one of the boundaries is to within tolerance, just stop
  if (Math.abs(fb) < t) return b;
  if (!validNumber(fb))
    throw `Brent's method f(b) is NAN for b = ${b}, other input was a = ${a}`;
  if (Math.abs(fa) < t) return a;
  if (!validNumber(fa))
    throw `Brent's method f(a) is NAN for a = ${a}, other input was b = ${b}`;
  if (fa * fb > 0)
    throw `Inputs in Brent [${a},${b}] do not bracket the root.  Function values are [${fa},${fb}]`;

  c = a;
  fc = fa;
  iter = 1;

  if (Math.abs(fc) < Math.abs(fb)) {
    a = b;
    b = c;
    c = a;
    fa = fb;
    fb = fc;
    fc = fa;
  }

  d = b - a;
  e = b - a;
  m = 0.5 * (c - b);

  tol = 2 * macheps * Math.abs(b) + t;
  while (Math.abs(m) > tol && fb != 0) {
    // See if a bisection is forced
    if (Math.abs(e) < tol || Math.abs(fa) <= Math.abs(fb)) {
      m = 0.5 * (c - b);
      d = e = m;
    } else {
      s = fb / fa;
      if (a == c) {
        // Linear interpolation
        p = 2 * m * s;
        q = 1 - s;
      } else {
        // Inverse quadratic interpolation
        q = fa / fc;
        r = fb / fc;
        m = 0.5 * (c - b);
        p = s * (2 * m * q * (q - r) - (b - a) * (r - 1));
        q = (q - 1) * (r - 1) * (s - 1);
      }
      if (p > 0)
        q = -q;
      else
        p = -p;
      s = e;
      e = d;
      m = 0.5 * (c - b);
      if (2 * p < 3 * m * q - Math.abs(tol * q) || p < Math.abs(0.5 * s * q)) {
        d = p / q;
      } else {
        m = 0.5 * (c - b);
        d = e = m;
      }
    }
    a = b;
    fa = fb;
    if (Math.abs(d) > tol)
      b += d;
    else if (m > 0)
      b += tol;
    else
      b += -tol;
    fb = f(b);
    if (!validNumber(fb)) throw `Brent's method f(t) is NAN for t = ${b}`;
    if (Math.abs(fb) < macheps) return b;
    if (fb * fc > 0) {
      c = a;
      fc = fa;
      d = e = b - a;
    }
    if (Math.abs(fc) < Math.abs(fb)) {
      a = b;
      b = c;
      c = a;
      fa = fb;
      fb = fc;
      fc = fa;
    }
    m = 0.5 * (c - b);
    tol = 2 * macheps * Math.abs(b) + t;
    iter += 1;
    if (!validNumber(a)) throw "Brent's method a is NAN";
    if (!validNumber(b)) throw "Brent's method b is NAN";
    if (!validNumber(c)) throw "Brent's method c is NAN";
    if (iter>maxiter) throw `Brent's method reached maximum number of steps of ${maxiter}`;
    if (Math.abs(fb) < 2 * macheps * Math.abs(b)) return b;
  }
  return b;
}

export { brent };
