(function(des) {
    'use strict';

    des.onestep.euler = function() {

        var y0 = [0];
        var xDomain = [0, 1];
        var h = 0.01;
        // Default ODE is y' = 0
        var ode = des.form.linearODE()
            .coefficients([0, 1]);

        function calculateYDash(currentY, odeCoefficients) {
            var arraySum = odeCoefficients.fX.map(function(d) { return -d; });
            arraySum = des.util.arraySum(arraySum,
                    currentY.map(function(d) { return d * odeCoefficients.yDerivative[0]; }));
            return arraySum.map(function(d) { return -d / odeCoefficients.yDerivative[1]; });
        }

        function euler() {
            var solution = [des.util.coordinatePair(xDomain[0], y0)];
            var currentY = y0;
            var iterations = (xDomain[1] - xDomain[0]) / h;

            var odeCoefficients = ode(xDomain[0]);
            var currentYDash = calculateYDash(currentY, odeCoefficients);

            var nextY = des.util.arraySum(currentY, currentYDash.map(function(d) { return d * h; }));
            solution.push(des.util.coordinatePair(xDomain[0] + h, nextY));

            for (var i = 1; i < iterations; i++) {
                currentY = nextY;
                odeCoefficients = ode(xDomain[0] + i * h);
                currentYDash = calculateYDash(currentY, odeCoefficients);

                nextY = des.util.arraySum(currentY, currentYDash.map(function(d) { return d * h; }));
                solution.push(des.util.coordinatePair(xDomain[0] + (i + 1) * h, nextY));
            }
            return solution;
        }

        euler.y0 = function(set) {
            if (!arguments.length) {
                return y0;
            }
            if (Array.isArray(set)) {
                y0 = set;
            } else {
                y0 = [set];
            }
            return euler;
        };

        euler.xDomain = function(set) {
            if (!arguments.length) {
                return xDomain;
            }
            xDomain = set;
            return euler;
        };

        euler.h = function(set) {
            if (!arguments.length) {
                return h;
            }
            h = set;
            return euler;
        };

        euler.ode = function(set) {
            if (!arguments.length) {
                return ode;
            }
            ode = set;
            return euler;
        };

        return euler;
    };
})(des);