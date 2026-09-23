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

// Complete-response scoring helpers. No questionnaire item text is reproduced.
const MSKScores = (() => {
  function value(raw, max, integer = false) {
    if (raw === null || raw === undefined || String(raw).trim() === '') throw new Error('Complete every required field; blank is not zero.');
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0 || n > max || (integer && !Number.isInteger(n))) throw new Error(`Enter ${integer ? 'a whole number' : 'a number'} from 0 to ${max}.`);
    return n;
  }
  const subscale = (raw, count) => 100 - value(raw, count * 4, true) / (count * 4) * 100;
  function spadi(pain, disability) {
    const p = value(pain, 50, true) / 50 * 100;
    const d = value(disability, 80, true) / 80 * 100;
    return { pain: p, disability: d, total: (p + d) / 2 };
  }
  function womac(pain, stiffness, functionScore) {
    const p = value(pain, 20, true), s = value(stiffness, 8, true), f = value(functionScore, 68, true);
    return { pain: p / 20 * 100, stiffness: s / 8 * 100, function: f / 68 * 100, raw: p + s + f, total: (p + s + f) / 96 * 100 };
  }
  function change(baseline, followup, max, integer = false) {
    const b = value(baseline, max, integer), f = value(followup, max, integer);
    return { reduction: b - f, percent: b === 0 ? null : (b - f) / b * 100 };
  }
  return { value, subscale, spadi, womac, change };
})();

(() => {
  const host = document.querySelector('#msk-calculators');
  if (!host) return;
  const style = document.createElement('style');
  style.textContent = '.msk-calc{min-width:0}.msk-calc .calc-fields{grid-template-columns:1fr}.msk-calc input,.msk-calc select{font-size:16px;min-height:44px}.msk-calc button{min-height:44px}.msk-calc .calc-source{overflow-wrap:anywhere;line-height:1.7}.msk-calc .calc-result{line-height:1.65}.msk-calc .calc-result strong{font-size:18px}.msk-calc .confirm{display:flex;flex-direction:row;align-items:flex-start;gap:9px;margin-top:16px;font-size:13px}.msk-calc .confirm input{width:20px;min-height:20px;flex:0 0 20px}.msk-calc button[type=reset]{background:transparent;color:var(--ink);border:1px solid var(--line);margin-left:8px}';
  document.head.append(style);
  const number = (name, label, max, step = 1) => `<label>${label}<input name="${name}" type="number" min="0" max="${max}" step="${step}" inputmode="${step === 1 ? 'numeric' : 'decimal'}" required autocomplete="off"></label>`;
  const select = (name, label, options) => `<label>${label}<select name="${name}">${options.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></label>`;
  const fixed = n => n.toFixed(1);
  function add(id, title, description, fields, source, sourceLabel, calculate, complete = false) {
    const form = document.createElement('form');
    form.id = id;
    form.className = 'calculator msk-calc';
    form.innerHTML = `<h3>${title}</h3><p>${description}</p><div class="calc-fields">${fields}</div>${complete ? '<label class="confirm"><input type="checkbox" name="complete" required>I confirm all items in the subscale(s) entered were answered on the stated questionnaire version.</label>' : ''}<button type="submit">Calculate</button><button type="reset">Clear</button><p class="calc-result" role="status" aria-live="polite">Enter values to calculate.</p><a class="calc-source" href="${source}" target="_blank" rel="noopener noreferrer">${sourceLabel} &#8599;&#65038;</a>`;
    const result = form.querySelector('.calc-result');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try { result.innerHTML = calculate(Object.fromEntries(new FormData(form))); }
      catch (error) { result.textContent = error.message; }
    });
    form.addEventListener('input', () => { result.textContent = 'Values changed. Calculate to update the result.'; });
    form.addEventListener('reset', () => { result.textContent = 'Enter values to calculate.'; });
    host.append(form);
    return form;
  }
  add('nrs-calculator', 'NRS · pain intensity', 'Record a whole-number pain rating: 0 = no pain; 10 = worst imaginable pain. Specify the context when comparing visits. No diagnostic severity category is assigned.',
    number('score', 'Pain rating (0–10)', 10) + select('context', 'Assessment context', [['now','Pain right now'],['rest','Pain at rest'],['activity','Pain with activity'],['week','Average pain over the past week']]),
    'https://www.va.gov/painmanagement/docs/pain_numberic_rating_scale.pdf', 'VA numeric pain scale', v => `<strong>NRS ${MSKScores.value(v.score, 10, true)} / 10</strong>Higher = more pain. Record the chosen context alongside this score.`);
  add('vas-calculator', 'VAS · measured score', 'Enter the distance from the no-pain end of a completed 100-mm visual analogue line. This is a measurement converter, not a validated on-screen VAS; a phone screen is not a calibrated 100-mm line.',
    number('distance', 'Measured distance (mm, 0–100)', 100, 0.1),
    'https://www.hsrd.research.va.gov/publications/esp/acute-pain-mgmt-and-assessment-2008.pdf', 'VA pain measurement review', v => {
      const mm = MSKScores.value(v.distance, 100);
      return `<strong>VAS ${fixed(mm)} / 100 mm</strong>${fixed(mm / 10)} cm on the same line. This conversion does not turn a VAS into an NRS. Higher = more pain.`;
    });
  function joint(id, title, counts, source) {
    const entries = Object.entries(counts);
    const form = add(id, title, 'Full-length questionnaire, one complete subscale at a time. Add its item scores (each 0–4). Output is 0–100, higher = fewer problems. Not a JR, 12-item, or physical-function short-form calculator; no combined total is produced.',
      select('domain', 'Subscale · number of items', entries.map(([key, [label, count]]) => [key, `${label} · ${count} items`])) + number('sum', 'Sum of item scores', entries[0][1][1] * 4),
      source, 'Official instrument guidance and access', v => {
        const [label, count] = counts[v.domain];
        return `<strong>${title.split(' · ')[0]} ${label}: ${fixed(MSKScores.subscale(v.sum, count))} / 100</strong>100 − (raw sum ÷ ${count * 4}) × 100. Complete ${count}-item subscale; higher = fewer problems.`;
      }, true);
    const update = () => {
      const count = counts[form.elements.domain.value][1];
      form.elements.sum.max = count * 4;
      form.elements.sum.setAttribute('aria-label', `Raw sum for ${count} items, 0 to ${count * 4}`);
      form.elements.sum.placeholder = `0–${count * 4}`;
    };
    form.elements.domain.addEventListener('change', () => { form.elements.sum.value = ''; form.elements.complete.checked = false; update(); });
    form.addEventListener('reset', () => setTimeout(update, 0));
    update();
  }
  joint('koos-calculator', 'KOOS · knee', { pain:['Pain',9], symptoms:['Symptoms',7], adl:['Daily activities',17], sport:['Sport/recreation',5], qol:['Quality of life',4] }, 'https://koos.nu/KOOSusersguide2012_RC.pdf');
  joint('hoos-calculator', 'HOOS · hip', { pain:['Pain',10], symptoms:['Symptoms',5], adl:['Daily activities',17], sport:['Sport/recreation',4], qol:['Quality of life',4] }, 'https://koos.nu/HOOSGuide2013_RC.pdf');
  add('spadi-calculator', 'SPADI · shoulder', 'Numeric 0–10 item version: enter all 5 pain and all 8 disability item scores as sums. Uses the mean of the two normalized subscales (equal subscale weighting), not the pooled 13-item method. Match your study protocol; do not mix methods.',
    number('pain', 'Pain sum · 5 items (0–50)', 50) + number('disability', 'Disability sum · 8 items (0–80)', 80),
    'https://www.sralab.org/rehabilitation-measures/shoulder-pain-and-disability-index', 'SPADI scoring reference', v => {
      const s = MSKScores.spadi(v.pain, v.disability);
      return `<strong>SPADI ${fixed(s.total)} / 100</strong>Pain ${fixed(s.pain)} / 100 · Disability ${fixed(s.disability)} / 100.<br>Total = (pain % + disability %) ÷ 2. Higher = more pain/disability.`;
    }, true);
  add('womac-calculator', 'WOMAC · knee & hip', 'Complete 24-item Likert version only, with each item scored 0–4. Enter raw sums from an authorized questionnaire. This is arithmetic normalization, not questionnaire administration. Other WOMAC response formats are not supported.',
    number('pain', 'Pain sum · 5 items (0–20)', 20) + number('stiffness', 'Stiffness sum · 2 items (0–8)', 8) + number('function', 'Function sum · 17 items (0–68)', 68),
    'https://koos.nu/HOOSGuide2013_RC.pdf', 'Raw subscale ranges · official HOOS guide', v => {
      const s = MSKScores.womac(v.pain, v.stiffness, v.function);
      return `<strong>Raw total ${s.raw} / 96</strong>Normalized total ${fixed(s.total)} / 100.<br>Pain ${fixed(s.pain)} · Stiffness ${fixed(s.stiffness)} · Function ${fixed(s.function)} (each / 100).<br>Raw ÷ maximum × 100: higher = worse. NOT the reversed HOOS-style transformation.`;
    }, true);
  add('pain-change-calculator', 'Pain change · follow-up', 'Compare the same NRS or measured VAS at two visits using the same recall period and activity context. Change does not prove clinical benefit or establish a treatment-response threshold.',
    select('scale', 'Instrument', [['10','NRS (0–10, whole numbers)'],['100','VAS (0–100 mm)']]) + number('baseline', 'Baseline pain', 100, 0.1) + number('followup', 'Follow-up pain', 100, 0.1),
    'https://www.va.gov/PAINMANAGEMENT/docs/PainOutcomesToolkit.pdf', 'VA outcomes toolkit', v => {
      const s = MSKScores.change(v.baseline, v.followup, Number(v.scale), v.scale === '10');
      const unit = v.scale === '10' ? 'NRS points' : 'mm VAS';
      const label = s.reduction > 0 ? 'decrease' : s.reduction < 0 ? 'increase' : 'change';
      return `<strong>${fixed(Math.abs(s.reduction))} ${unit} ${label}</strong>${s.percent === null ? 'Percentage change cannot be calculated from a zero baseline.' : `${fixed(Math.abs(s.percent))}% ${label} relative to baseline.`}<br>Baseline minus follow-up; no clinical significance cutoff applied.`;
    });
})();
