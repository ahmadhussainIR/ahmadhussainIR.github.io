(() => {
  const result = (form, html) => { form.querySelector('.calc-result').innerHTML = html; };
  document.querySelector('#child-pugh-calculator')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const total = [...new FormData(form).values()].reduce((sum, value) => sum + Number(value), 0);
    const grade = total <= 6 ? 'A' : total <= 9 ? 'B' : 'C';
    result(form, `<strong>${total} points · Class ${grade}</strong>Class A: 5–6 · B: 7–9 · C: 10–15`);
  });
  document.querySelector('#albi-calculator')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const albuminGL = Number(values.albumin) * 10;
    const bilirubinUMol = Number(values.bilirubin) * 17.1;
    if (!(albuminGL > 0 && bilirubinUMol > 0)) return result(form, 'Enter positive laboratory values.');
    const score = (Math.log10(bilirubinUMol) * 0.66) - (albuminGL * 0.0852);
    const grade = score <= -2.60 ? 1 : score <= -1.39 ? 2 : 3;
    result(form, `<strong>ALBI ${score.toFixed(2)} · Grade ${grade}</strong>Original ALBI grade thresholds.`);
  });
  document.querySelector('#egfr-calculator')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const age = Number(values.age), creatinine = Number(values.creatinine), female = values.sex === 'female';
    if (!(age >= 18 && creatinine > 0)) return result(form, 'Enter a valid adult age and creatinine value.');
    const kappa = female ? 0.7 : 0.9, alpha = female ? -0.241 : -0.302, ratio = creatinine / kappa;
    const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
    result(form, `<strong>${Math.round(egfr)} mL/min/1.73 m²</strong>Estimated GFR; compare with the reporting laboratory and clinical context.`);
  });
  document.querySelector('#recist-calculator')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const baseline = Number(values.baseline), nadir = Number(values.nadir), current = Number(values.current);
    if (!(baseline > 0 && nadir > 0 && current >= 0)) return result(form, 'Enter valid diameter sums.');
    const fromBaseline = ((current - baseline) / baseline) * 100;
    const fromNadir = ((current - nadir) / nadir) * 100;
    const absolute = current - nadir;
    let label = 'Size thresholds suggest stable disease';
    if (current === 0) label = 'Target lesions measure zero; complete response still requires full criteria';
    else if (fromNadir >= 20 && absolute >= 5) label = 'Size thresholds meet progressive disease';
    else if (fromBaseline <= -30) label = 'Size thresholds meet partial response';
    result(form, `<strong>${label}</strong>${fromBaseline.toFixed(1)}% from baseline · ${fromNadir.toFixed(1)}% from nadir · ${absolute.toFixed(1)} mm from nadir`);
  });
})();
