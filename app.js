        ['Incline Cable Press', '2-3 × 8-10 (to failure)', ''],
        ['Dip (Stretch Ladder)', '1 × to failure', ''],
        ['Prison Yard Push-Up', '1 × to failure', '']
      ]
    },
    legs1: {
      name: 'Legs - Workout 1',
      type: 'legs',
      rows: [
        ['Reverse Hyper (Primer)', '1-2 × 10-15', ''],
        ['Deadlift', '3 × 5', ''],
        ['Barbell Front Squat', '2-3 × 6-8', ''],
        ['Alternating DB Reverse Lunge', '2-3 × 10/leg (to failure)', ''],
        ['Seated Hamstring Curl', '1 × 12-15 (to eccentric failure)', ''],
        ['Standing Calf Raise', '2-3 × to failure', '']
      ]
    },
    legs2: {
      name: 'Legs - Workout 2',
      type: 'legs',
      rows: [
        ['Banded Overhead Squat (Primer)', '1-2 × 10-15', ''],
        ['Barbell Back Squat', '3 × 7', ''],
        ['Barbell Hip Thrust', '2-3 × 6-8', ''],
        ['Dumbbell Spanish Squat', '2-3 × 10 (to failure)', ''],
        ['Glute-Ham Raise (GHR)', '1 × to failure (with eccentrics)', ''],
        ['Seated Calf Raise', '2-3 × 10-12 (to failure + partials)', '']
      ]
    },
    triceps1: {
      name: 'Triceps - Workout 1',
      type: 'push',
      rows: [
        ['Tricep Push Down', '2-3 × 6-8 (to failure)', ''],
        ['Lying Dumbbell Extension', '2-3 × 8-10 (to failure + eccentrics)', ''],
        ['Dumbbell/Cable Tricep Kickback', '2-3 × 10-12 (to failure + partials)', ''],
        ['Cobra Push-Up', '1 × to failure', '']
      ]
    },
    triceps2: {
      name: 'Triceps - Workout 2',
      type: 'push',
      rows: [['(Add movements)', 'TBD', '']]
    },
    shoulders1: {
      name: 'Shoulders - Workout 1',
      type: 'push',
      rows: [['(Add movements)', 'TBD', '']]
    },
    shoulders2: {
      name: 'Shoulders - Workout 2',
      type: 'push',
      rows: [['(Add movements)', 'TBD', '']]
    },
    shoulders_eff: {
      name: 'Shoulders - Effective Reps',
      type: 'push',
      rows: [
        ['Lateral Raise (Dumbbell)', 'Ignition: 1 × 8-12 to failure; then mini-sets', ''],
        ['Overhead Press (Dumbbell)', 'As Push Press — Ignition set 1 × 8-12', '']
      ]
    }
  };

  // Science config
  function renderScienceConfig() {
    ensureMeta();
    const cfg = $('#program-config');
    cfg.innerHTML = '';

    const title = el('h2', {}, 'Science‑Based (Full Workout)');
    const p = el('p', { class: 'muted' }, 'Choose a template, then tweak TMs, rounding, and accessories.');

    const tplSel = el('select', { 'aria-label': 'Workout template' });
    [
      ['back1', 'Back - Workout 1'],
      ['back2', 'Back - Workout 2'],
      ['chest1', 'Chest - Workout 1'],
      ['chest2', 'Chest - Workout 2'],
      ['legs1', 'Legs - Workout 1'],
      ['legs2', 'Legs - Workout 2'],
      ['triceps1', 'Triceps - Workout 1'],
      ['triceps2', 'Triceps - Workout 2'],
      ['shoulders1', 'Shoulders - Workout 1'],
      ['shoulders2', 'Shoulders - Workout 2'],
      ['shoulders_eff', 'Shoulders - Effective Reps']
    ].forEach(([v, txt]) => {
      const o = el('option', { value: v }, txt);
      if ((S.sci?.template || 'back1') === v) o.selected = true;
      tplSel.appendChild(o);
    });
    tplSel.addEventListener('input', () => {
      S.sci = S.sci || {};
      S.sci.template = tplSel.value;
      saveState();
      renderCurrentProgram();
    });

    const grid4 = el('div', { class: 'grid-4', style: 'margin-top:12px' });
    const tm = S.tm;
    [
      ['Squat', 'squat'],
      ['Bench', 'bench'],
      ['Deadlift', 'dead'],
      ['Overhead Press', 'ohp']
    ].forEach(([lbl, key]) => {
      const wrap = el('div');
      const labelEl = el('label');
      labelEl.appendChild(createTooltip(`${lbl} TM (lb)`, 'Training Max: typically 90% of your 1-rep max'));
      const numInput = createNumberInput({
        value: tm[key],
        min: 0,
        max: 1000,
        step: 5,
        label: `${lbl} TM`,
        onChange: v => {
          S.tm[key] = v;
          saveState();
          renderCurrentProgram();
        }
      });
      const rmCalc = el('div', { class: 'rm-calc' }, `Est. 1RM: ${calc1RM(tm[key])} lb`);
      wrap.appendChild(labelEl);
      wrap.appendChild(numInput);
      wrap.appendChild(rmCalc);
      grid4.appendChild(wrap);
    });

    const topGrid = el('div', { class: 'grid', style: 'margin-top:12px' });
    const tplWrap = el('div');
    tplWrap.appendChild(el('label', {}, 'Template'));
    tplWrap.appendChild(tplSel);

    const roundSel = el('select', { 'aria-label': 'Rounding increment' });
    [['1', '1 lb'], ['2.5', '2.5 lb'], ['5', '5 lb'], ['10', '10 lb']].forEach(([v, txt]) => {
      const opt = el('option', { value: v }, txt);
      if (+S.round === +v) opt.selected = true;
      roundSel.appendChild(opt);
    });
    roundSel.addEventListener('input', () => {
      S.round = +roundSel.value;
      saveState();
      renderCurrentProgram();
    });

    const roundWrap = el('div');
    roundWrap.appendChild(el('label', {}, 'Round to nearest'));
    roundWrap.appendChild(roundSel);
    topGrid.appendChild(tplWrap);
    topGrid.appendChild(roundWrap);

    // Collapsible accessories
    const accCard = el('div', { style: 'margin-top:16px' });
    const accHeader = el('div', { class: 'collapsible' });
    accHeader.innerHTML = '<h3 style="margin:0">Accessories Configuration</h3><span class="collapsible-arrow">▼</span>';
    const accContent = el('div', { class: 'collapsible-content' });

    const accLists = {
      ohp: ['Dips', 'Lateral Raises', 'Face Pulls', 'Triceps Pushdowns', 'Incline DB Press', 'Push‑ups'],
      dead: ['Back Extensions', 'Hanging Leg Raises', 'Hamstring Curls', 'Barbell Rows', 'Pull‑ups', 'Reverse Hypers'],
      bench: ['DB Incline Press', 'Triceps Pushdowns', 'Chest Flyes', 'Push‑ups', 'CGBP', 'Face Pulls'],
      squat: ['Leg Press', 'Walking Lunges', 'Bulgarian Split Squats', 'Leg Extensions', 'Hack Squat', 'Calf Raises']
    };

    const days = [
      { label: 'Day 1 — Overhead Press', key: 'ohp' },
      { label: 'Day 2 — Deadlift', key: 'dead' },
      { label: 'Day 3 — Bench', key: 'bench' },
      { label: 'Day 4 — Squat', key: 'squat' }
    ];

    function buildRow(d) {
      const row = el('div', { style: 'margin:16px 0' });
      row.appendChild(el('h4', {}, d.label));

      ['A', 'B'].forEach((slot, i) => {
        const meta = getAccMeta(d.key, i);
        const wrap = el('div', { class: 'grid', style: 'margin:8px 0' });

        const sel = el('select', { 'aria-label': `Accessory ${slot}` });
        (accLists[d.key] || []).forEach(name => {
          const o = el('option', { value: name }, name);
          if ((S.acc?.[d.key] || [])[i] === name) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('input', () => {
          const arr = S.acc[d.key] || ['', ''];
          arr[i] = sel.value;
          S.acc[d.key] = arr;
          saveState();
          renderCurrentProgram();
        });

        const sets = createNumberInput({
          value: meta.sets,
          min: 1,
          max: 10,
          step: 1,
          label: 'Sets',
          onChange: v => {
            setAccMeta(d.key, i, 'sets', v);
            renderCurrentProgram();
          }
        });

        const reps = createNumberInput({
          value: meta.reps,
          min: 1,
          max: 30,
          step: 1,
          label: 'Reps',
          onChange: v => {
            setAccMeta(d.key, i, 'reps', v);
            renderCurrentProgram();
          }
        });

        const rpe = createNumberInput({
          value: meta.rpe,
          min: 5,
          max: 10,
          step: 0.5,
          label: 'RPE',
          onChange: v => {
            setAccMeta(d.key, i, 'rpe', v);
            renderCurrentProgram();
          }
        });

        const notes = el('input', {
          type: 'text',
          placeholder: 'Notes (optional)',
          value: meta.notes || '',
          'aria-label': 'Exercise notes'
        });
        notes.addEventListener('input', () => {
          setAccMeta(d.key, i, 'notes', notes.value);
        });

        const c1 = el('div');
        const lbl1 = el('label');
        lbl1.appendChild(document.createTextNode(`Accessory ${slot}`));
        c1.appendChild(lbl1);
        c1.appendChild(sel);

        const c2 = el('div');
        const lbl2 = el('label');
        lbl2.appendChild(createTooltip('Sets', 'Number of sets'));
        c2.appendChild(lbl2);
        c2.appendChild(sets);

        const c3 = el('div');
        const lbl3 = el('label');
        lbl3.appendChild(createTooltip('Reps', 'Target reps per set'));
        c3.appendChild(lbl3);
        c3.appendChild(reps);

        const c4 = el('div');
        const lbl4 = el('label');
        lbl4.appendChild(createTooltip('RPE', 'Rate of Perceived Exertion: 8=2 reps left, 9=1 rep left, 10=max'));
        c4.appendChild(lbl4);
        c4.appendChild(rpe);

        const c5 = el('div', { style: 'grid-column:1/-1' });
        c5.appendChild(el('label', {}, 'Notes'));
        c5.appendChild(notes);

        wrap.appendChild(c1);
        wrap.appendChild(c2);
        wrap.appendChild(c3);
        wrap.appendChild(c4);
        wrap.appendChild(c5);
        row.appendChild(wrap);
      });
      return row;
    }

    days.forEach(d => {
      if (!S.acc[d.key]) S.acc[d.key] = ['', ''];
      accContent.appendChild(buildRow(d));
    });

    accHeader.addEventListener('click', () => {
      accContent.classList.toggle('open');
      accHeader.querySelector('.collapsible-arrow').classList.toggle('open');
    });

    accCard.appendChild(accHeader);
    accCard.appendChild(accContent);

    // Buttons
    const actions = el('div', { class: 'btn-group' });

    function btn(txt, cb) {
      const b = el('button', {}, txt);
      b.addEventListener('click', cb);
      return b;
    }

    function download(name, text) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    actions.appendChild(btn('💾 Save', () => {
      download('workout-save.json', JSON.stringify(S, null, 2));
      showToast('Saved!', 'success');
    }));

    actions.appendChild(btn('📂 Load', () => {
      const inp = el('input', { type: 'file', accept: '.json' });
      inp.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const obj = JSON.parse(ev.target.result);
            S = Object.assign({}, S, obj);
            saveState();
            renderCurrentProgram();
            showToast('Loaded!', 'success');
          } catch (err) {
            showToast('Invalid file', 'error');
          }
        };
        reader.readAsText(file);
      });
      inp.click();
    }));

    actions.appendChild(btn('🔄 Reset', () => {
      if (confirm('Reset all data?')) {
        S = JSON.parse(JSON.stringify(defaultState));
        saveState();
        renderCurrentProgram();
        showToast('Reset complete', 'success');
      }
    }));

    actions.appendChild(btn('📄 Export TXT', () => {
      const tpl = SCI_TEMPLATES[(S.sci && S.sci.template) || 'back1'];
      let lines = [`${tpl.name}`, '', 'Exercise\tDuration/Reps\tSets'];
      tpl.rows.forEach(r => lines.push(r.join('\t')));
      download('workout.txt', lines.join('\n'));
      showToast('Exported!', 'success');
    }));

    actions.appendChild(btn('📊 Export CSV', () => {
      const tpl = SCI_TEMPLATES[(S.sci && S.sci.template) || 'back1'];
      let lines = ['Exercise,Duration/Reps,Sets'];
      tpl.rows.forEach(r => lines.push(r.map(c => `"${c}"`).join(',')));
      download('workout.csv', lines.join('\n'));
      showToast('Exported!', 'success');
    }));

    actions.appendChild(btn('✅ Complete', () => {
      saveWorkoutToHistory();
    }));

    cfg.appendChild(title);
    cfg.appendChild(p);
    cfg.appendChild(tplWrap);
    cfg.appendChild(grid4);
    cfg.appendChild(topGrid);
    cfg.appendChild(accCard);
    cfg.appendChild(actions);
  }

  // Science output
  function renderScienceOutput() {
    const tplKey = (S.sci && S.sci.template) || 'back1';
    const tpl = SCI_TEMPLATES[tplKey] || SCI_TEMPLATES['back1'];
    const out = $('#program-output');
    const progress = getWorkoutProgress('science_' + tplKey);

    const progressBar = el('div');
    progressBar.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">${tpl.name} <span class="chip ${tpl.type}">${tpl.type.toUpperCase()}</span></h3>
        <span class="muted">${progress}% complete</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
    `;

    const table = el('table', { id: 'sci-table', 'aria-label': 'Science-based table' });
    table.innerHTML = '<thead><tr><th>✓</th><th>Exercise</th><th>Duration/Reps</th><th>Sets</th></tr></thead><tbody></tbody>';
    const tbody = $('tbody', table);

    tpl.rows.forEach(([ex, dr, setc], idx) => {
      const tr = el('tr');
      const isComplete = isSetComplete('science_' + tplKey, ex, idx);

      const checkTd = el('td');
      const checkbox = el('input', {
        type: 'checkbox',
        class: 'checkbox',
        'aria-label': `Mark ${ex} complete`
      });
      checkbox.checked = isComplete;
      checkbox.addEventListener('change', () => {
        toggleSetCompletion('science_' + tplKey, ex, idx);
      });
      checkTd.appendChild(checkbox);

      const exTd = el('td', { class: isComplete ? 'completed' : '' }, ex);
      const drTd = el('td', { class: isComplete ? 'completed' : '' }, dr);
      const setTd = el('td', { class: isComplete ? 'completed' : '' }, setc || '');

      tr.appendChild(checkTd);
      tr.appendChild(exTd);
      tr.appendChild(drTd);
      tr.appendChild(setTd);
      tbody.appendChild(tr);
    });

    out.innerHTML = '';
    out.appendChild(progressBar);
    out.appendChild(table);
    out.appendChild(el('p', { class: 'muted' }, 'Template is editable via accessories section above.'));
  }

  // BBB config
  function renderBBBConfig() {
    const accLists = {
      ohp: ['Dips', 'Lateral Raises', 'Face Pulls', 'Triceps Pushdowns', 'Incline DB Press', 'Push‑ups'],
      dead: ['Back Extensions', 'Hanging Leg Raises', 'Hamstring Curls', 'Barbell Rows', 'Pull‑ups', 'Reverse Hypers'],
      bench: ['DB Incline Press', 'Triceps Pushdowns', 'Chest Flyes', 'Push‑ups', 'CGBP', 'Face Pulls'],
      squat: ['Leg Press', 'Walking Lunges', 'Bulgarian Split Squats', 'Leg Extensions', 'Hack Squat', 'Calf Raises']
    };

    ensureMeta();
    const cfg = $('#program-config');
    cfg.innerHTML = '';

    const title = el('h2', {}, '5/3/1 — Boring But Big');
    const p = el('p', { class: 'muted' });
    p.appendChild(document.createTextNode('Enter '));
    p.appendChild(createTooltip('TMs', 'Training Max: 90% of 1RM'));
    p.appendChild(document.createTextNode(', choose week & '));
    p.appendChild(createTooltip('BBB %', '50-60% beginner, 60-70% advanced'));
    p.appendChild(document.createTextNode(', auto‑calculates sets.'));

    const grid4 = el('div', { class: 'grid-4' });
    const tm = S.tm;

    [
      ['Squat', 'squat'],
      ['Bench', 'bench'],
      ['Deadlift', 'dead'],
      ['OHP', 'ohp']
    ].forEach(([lbl, key]) => {
      const wrap = el('div');
      const labelEl = el('label');
      labelEl.appendChild(createTooltip(`${lbl} TM (lb)`, 'Training Max: 90% of 1RM'));

      const numInput = createNumberInput({
        value: tm[key],
        min: 0,
        max: 1000,
        step: 5,
        label: `${lbl} TM`,
        onChange: v => {
          S.tm[key] = v;
          saveState();
          renderCurrentProgram();
        }
      });

      const rmCalc = el('div', { class: 'rm-calc' }, `Est. 1RM: ${calc1RM(tm[key])} lb`);
      wrap.appendChild(labelEl);
      wrap.appendChild(numInput);
      wrap.appendChild(rmCalc);
      grid4.appendChild(wrap);
    });

    const grid = el('div', { class: 'grid', style: 'margin-top:12px' });

    const weekSel = el('select', { 'aria-label': 'Training week' });
    [
      ['1', 'Week 1 — 65/75/85 × 5+'],
      ['2', 'Week 2 — 70/80/90 × 3+'],
      ['3', 'Week 3 — 75/85/95 × 1+'],
      ['4', 'Week 4 — Deload']
    ].forEach(([v, txt]) => {
      const opt = el('option', { value: v }, txt);
      if (S.week === v) opt.selected = true;
      weekSel.appendChild(opt);
    });
    weekSel.addEventListener('input', () => {
      S.week = weekSel.value;
      saveState();
      renderCurrentProgram();
    });

    const bbbSel = el('select', { 'aria-label': 'BBB percentage' });
    [
      ['0.5', '50%'],
      ['0.6', '60%'],
      ['0.7', '70%']
    ].forEach(([v, txt]) => {
      const opt = el('option', { value: v }, txt);
      if (+S.bbbpct === +v) opt.selected = true;
      bbbSel.appendChild(opt);
    });
    bbbSel.addEventListener('input', () => {
      S.bbbpct = +bbbSel.value;
      saveState();
      renderCurrentProgram();
    });

    const roundSel = el('select', { 'aria-label': 'Rounding' });
    [
      ['1', '1 lb'],
      ['2.5', '2.5 lb'],
      ['5', '5 lb'],
      ['10', '10 lb']
    ].forEach(([v, txt]) => {
      const opt = el('option', { value: v }, txt);
      if (+S.round === +v) opt.selected = true;
      roundSel.appendChild(opt);
    });
    roundSel.addEventListener('input', () => {
      S.round = +roundSel.value;
      saveState();
      renderCurrentProgram();
    });

    const wWrap = el('div');
    wWrap.appendChild(el('label', {}, 'Week'));
    wWrap.appendChild(weekSel);

    const bWrap = el('div');
    bWrap.appendChild(el('label', {}, 'BBB % (5×10)'));
    bWrap.appendChild(bbbSel);

    grid.appendChild(wWrap);
    grid.appendChild(bWrap);

    const roundWrap = el('div', { style: 'margin-top:12px;max-width:240px' });
    roundWrap.appendChild(el('label', {}, 'Round to'));
    roundWrap.appendChild(roundSel);

    // Collapsible accessories
    const accCard = el('div', { style: 'margin-top:16px' });
    const accHeader = el('div', { class: 'collapsible' });
    accHeader.innerHTML = '<h3 style="margin:0">Accessories</h3><span class="collapsible-arrow">▼</span>';
    const accContent = el('div', { class: 'collapsible-content' });

    const days = [
      { label: 'Day 1 — OHP', key: 'ohp' },
      { label: 'Day 2 — Deadlift', key: 'dead' },
      { label: 'Day 3 — Bench', key: 'bench' },
      { label: 'Day 4 — Squat', key: 'squat' }
    ];

    function buildRow(d) {
      const row = el('div', { style: 'margin:16px 0' });
      row.appendChild(el('h4', {}, d.label));

      ['A', 'B'].forEach((slot, i) => {
        const meta = getAccMeta(d.key, i);
        const wrap = el('div', { class: 'grid', style: 'margin:8px 0' });

        const sel = el('select');
        (accLists[d.key] || []).forEach(name => {
          const o = el('option', { value: name }, name);
          if ((S.acc?.[d.key] || [])[i] === name) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('input', () => {
          const arr = S.acc[d.key] || ['', ''];
          arr[i] = sel.value;
          S.acc[d.key] = arr;
          saveState();
          renderCurrentProgram();
        });

        const sets = createNumberInput({
          value: meta.sets,
          min: 1,
          max: 10,
          step: 1,
          onChange: v => {
            setAccMeta(d.key, i, 'sets', v);
            renderCurrentProgram();
          }
        });

        const reps = createNumberInput({
          value: meta.reps,
          min: 1,
          max: 30,
          step: 1,
          onChange: v => {
            setAccMeta(d.key, i, 'reps', v);
            renderCurrentProgram();
          }
        });

        const rpe = createNumberInput({
          value: meta.rpe,
          min: 5,
          max: 10,
          step: 0.5,
          onChange: v => {
            setAccMeta(d.key, i, 'rpe', v);
            renderCurrentProgram();
          }
        });

        const notes = el('input', {
          type: 'text',
          placeholder: 'Notes',
          value: meta.notes || ''
        });
        notes.addEventListener('input', () => {
          setAccMeta(d.key, i, 'notes', notes.value);
        });

        const c1 = el('div');
        c1.appendChild(el('label', {}, `Acc ${slot}`));
        c1.appendChild(sel);

        const c2 = el('div');
        c2.appendChild(el('label', {}, 'Sets'));
        c2.appendChild(sets);

        const c3 = el('div');
        c3.appendChild(el('label', {}, 'Reps'));
        c3.appendChild(reps);

        const c4 = el('div');
        c4.appendChild(el('label', {}, 'RPE'));
        c4.appendChild(rpe);

        const c5 = el('div', { style: 'grid-column:1/-1' });
        c5.appendChild(el('label', {}, 'Notes'));
        c5.appendChild(notes);

        wrap.appendChild(c1);
        wrap.appendChild(c2);
        wrap.appendChild(c3);
        wrap.appendChild(c4);
        wrap.appendChild(c5);
        row.appendChild(wrap);
      });
      return row;
    }

    days.forEach(d => {
      if (!S.acc[d.key]) S.acc[d.key] = ['', ''];
      accContent.appendChild(buildRow(d));
    });

    accHeader.addEventListener('click', () => {
      accContent.classList.toggle('open');
      accHeader.querySelector('.collapsible-arrow').classList.toggle('open');
    });

    accCard.appendChild(accHeader);
    accCard.appendChild(accContent);

    // Buttons
    const actions = el('div', { class: 'btn-group' });

    function btn(txt, cb) {
      const b = el('button', {}, txt);
      b.addEventListener('click', cb);
      return b;
    }

    function download(name, text) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    actions.appendChild(btn('💾 Save', () => {
      download('workout-save.json', JSON.stringify(S, null, 2));
      showToast('Saved!', 'success');
    }));

    actions.appendChild(btn('📂 Load', () => {
      const inp = el('input', { type: 'file', accept: '.json' });
      inp.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const obj = JSON.parse(ev.target.result);
            S = Object.assign({}, S, obj);
            saveState();
            renderCurrentProgram();
            showToast('Loaded!', 'success');
          } catch (err) {
            showToast('Invalid file', 'error');
          }
        };
        reader.readAsText(file);
      });
      inp.click();
    }));

    actions.appendChild(btn('🔄 Reset', () => {
      if (confirm('Reset all?')) {
        S = JSON.parse(JSON.stringify(defaultState));
        saveState();
        renderCurrentProgram();
        showToast('Reset!', 'success');
      }
    }));

    actions.appendChild(btn('📄 Export CSV', () => {
      const weeks = { 1: [0.65, 0.75, 0.85], 2: [0.70, 0.80, 0.90], 3: [0.75, 0.85, 0.95], 4: [0.40, 0.50, 0.60] };
      const days = [
        { name: 'Day 1', lift: 'OHP', key: 'ohp' },
        { name: 'Day 2', lift: 'Deadlift', key: 'dead' },
        { name: 'Day 3', lift: 'Bench', key: 'bench' },
        { name: 'Day 4', lift: 'Squat', key: 'squat' }
      ];
      const tm = S.tm;
      const wk = S.week;
      const p = weeks[wk];
      const bbbpct = +S.bbbpct;
      const rnd = +S.round;

      let lines = ['Day,Lift,Set 1,Set 2,Set 3,BBB 5x10,Accessories'];
      days.forEach(d => {
        const t = tm[d.key] || 0;
        const s1 = roundTo(t * p[0], rnd);
        const s2 = roundTo(t * p[1], rnd);
        const s3 = roundTo(t * p[2], rnd);
        const bbb = roundTo(t * bbbpct, rnd);
        const amrap = (wk === '4') ? 'x5' : (wk === '1' ? 'x5+' : (wk === '2' ? 'x3+' : 'x1+'));
        lines.push(`"${d.name}","${d.lift}","${s1} x 5","${s2} x 5","${s3} ${amrap}","${bbb} x 10","${accStr(d.key)}"`);
      });
      download('bbb-workout.csv', lines.join('\n'));
      showToast('Exported!', 'success');
    }));

    actions.appendChild(btn('✅ Complete', () => {
      saveWorkoutToHistory();
    }));

    cfg.appendChild(title);
    cfg.appendChild(p);
    cfg.appendChild(grid4);
    cfg.appendChild(grid);
    cfg.appendChild(roundWrap);
    cfg.appendChild(accCard);
    cfg.appendChild(actions);
  }

  // BBB output
  function renderBBBTable() {
    const weeks = { 1: [0.65, 0.75, 0.85], 2: [0.70, 0.80, 0.90], 3: [0.75, 0.85, 0.95], 4: [0.40, 0.50, 0.60] };
    const days = [
      { name: 'Day 1', lift: 'OHP', key: 'ohp', type: 'push' },
      { name: 'Day 2', lift: 'Deadlift', key: 'dead', type: 'pull' },
      { name: 'Day 3', lift: 'Bench', key: 'bench', type: 'push' },
      { name: 'Day 4', lift: 'Squat', key: 'squat', type: 'legs' }
    ];
    const tm = S.tm;
    const wk = S.week;
    const p = weeks[wk];
    const bbbpct = +S.bbbpct;
    const rnd = +S.round;

    const out = $('#program-output');
    const progress = getWorkoutProgress('bbb_' + wk);

    const progressBar = el('div');
    progressBar.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <h3 style="margin:0">Week ${wk} ${wk === '4' ? '(Deload)' : ''} <span class="chip">5/3/1 BBB</span></h3>
        <span class="muted">${progress}% complete</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%"></div>
      </div>
    `;

    const table = el('table', { id: 'bbb-table', 'aria-label': '5/3/1 table' });
    table.innerHTML = '<thead><tr><th>✓</th><th>Day</th><th>Lift</th><th>Set 1</th><th>Set 2</th><th>Set 3</th><th>BBB 5×10</th><th>Accessories</th></tr></thead><tbody></tbody>';
    const tbody = $('tbody', table);

    days.forEach((d, dayIdx) => {
      const t = tm[d.key] || 0;
      const s1 = roundTo(t * p[0], rnd);
      const s2 = roundTo(t * p[1], rnd);
      const s3 = roundTo(t * p[2], rnd);
      const bbb = roundTo(t * bbbpct, rnd);
      const amrap = (wk === '4') ? '×5' : (wk === '1' ? '×5+' : (wk === '2' ? '×3+' : '×1+'));

      const isComplete = isSetComplete('bbb_' + wk, d.lift, dayIdx);

      const tr = el('tr');

      const checkTd = el('td');
      const checkbox = el('input', {
        type: 'checkbox',
        class: 'checkbox',
        'aria-label': `Mark ${d.lift} complete`
      });
      checkbox.checked = isComplete;
      checkbox.addEventListener('change', () => {
        toggleSetCompletion('bbb_' + wk, d.lift, dayIdx);
      });
      checkTd.appendChild(checkbox);

      const dayTd = el('td', { class: isComplete ? 'completed' : '' });
      dayTd.innerHTML = `${d.name} <span class="chip ${d.type}">${d.type}</span>`;

      const liftTd = el('td', { class: isComplete ? 'completed' : '' }, d.lift);

      const s1Td = el('td', { class: isComplete ? 'completed' : '' });
      s1Td.innerHTML = `${fmt(s1)} × 5` + calculatePlates(s1);

      const s2Td = el('td', { class: isComplete ? 'completed' : '' });
      s2Td.innerHTML = `${fmt(s2)} × 5` + calculatePlates(s2);

      const s3Td = el('td', { class: isComplete ? 'completed' : '' });
      s3Td.innerHTML = `${fmt(s3)} ${amrap}` + calculatePlates(s3);

      const bbbTd = el('td', { class: isComplete ? 'completed' : '' });
      bbbTd.innerHTML = `${fmt(bbb)} × 10 (5 sets)` + calculatePlates(bbb);

      const accTd = el('td', { class: isComplete ? 'completed' : '' }, accStr(d.key));

      tr.appendChild(checkTd);
      tr.appendChild(dayTd);
      tr.appendChild(liftTd);
      tr.appendChild(s1Td);
      tr.appendChild(s2Td);
      tr.appendChild(s3Td);
      tr.appendChild(bbbTd);
      tr.appendChild(accTd);
      tbody.appendChild(tr);
    });

    out.innerHTML = '';
    out.appendChild(progressBar);
    out.appendChild(table);
    out.appendChild(el('p', { class: 'muted' }, 'Main sets follow classic 5/3/1. BBB is 5×10 at chosen percentage. Plates shown per side.'));
  }

  // Programs
  const programs = {
    science: {
      name: 'Science‑Based (Full Workout)',
      renderConfig: renderScienceConfig,
      renderOutput: renderScienceOutput
    },
    bbb531: {
      name: '5/3/1 — Boring But Big',
      renderConfig: renderBBBConfig,
      renderOutput: renderBBBTable
    }
  };

  // Render current program
  function renderCurrentProgram() {
    const id = S.program;
    const prog = programs[id] || programs['bbb531'];
    $('#program-badge').textContent = prog.name;
    prog.renderConfig();
    prog.renderOutput();
    renderHistory();
  }

  // Touch gestures
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 100;

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) < swipeThreshold) return;

    const progs = ['science', 'bbb531'];
    const currentIdx = progs.indexOf(S.program);

    if (diff > 0 && currentIdx < progs.length - 1) {
      S.program = progs[currentIdx + 1];
    } else if (diff < 0 && currentIdx > 0) {
      S.program = progs[currentIdx - 1];
    } else {
      return;
    }

    $('#program-select').value = S.program;
    saveState();
    renderCurrentProgram();
    showToast(`Switched to ${programs[S.program].name}`, 'success');
  }

  // Program select
  const progSelect = $('#program-select');
  progSelect.value = S.program;
  progSelect.addEventListener('input', () => {
    S.program = progSelect.value;
    saveState();
    renderCurrentProgram();
  });

  // Initialize
  renderCurrentProgram();

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const json = JSON.stringify(S, null, 2);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      a.download = 'workout-save.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      showToast('Progress saved!', 'success');
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      openTimerModal();
    }
  });

  // Online/offline status
  function updateStatus() {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    if (navigator.onLine) {
      dot.classList.remove('offline');
      text.textContent = 'Online';
    } else {
      dot.classList.add('offline');
      text.textContent = 'Offline';
    }
  }

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
    });
  }
})();// Workout App - Enhanced Version
(function() {
  'use strict';

  // Utilities
  const $ = (s, r = document) => r.querySelector(s);
  const el = (t, a = {}, h = '') => {
    const n = document.createElement(t);
    Object.entries(a).forEach(([k, v]) => n.setAttribute(k, v));
    if (h) n.innerHTML = h;
    return n;
  };
  const roundTo = (x, b) => Math.round((+x || 0) / (+b || 1)) * (+b || 1);
  const fmt = w => ((w > 0 ? w : 0).toFixed(0)) + " lb";

  // Toast
  function showToast(msg, type = 'success') {
    const t = $('#toast');
    t.textContent = msg;
    t.className = `toast ${type}`;
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  // Modal
  window.openModal = function(title, body) {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = body;
    $('#modal').classList.add('show');
  };

  window.closeModal = function() {
    $('#modal').classList.remove('show');
  };

  $('#modal').addEventListener('click', e => {
    if (e.target === $('#modal')) closeModal();
  });

  // State
  const stateKey = 'workout_demo_state_v2';
  const defaultState = {
    program: 'science',
    tm: { squat: 315, bench: 225, dead: 405, ohp: 135 },
    week: '1',
    bbbpct: 0.6,
    round: 5,
    acc: {
      ohp: ['Dips', 'Lateral Raises'],
      dead: ['Back Extensions', 'Hanging Leg Raises'],
      bench: ['DB Incline Press', 'Triceps Pushdowns'],
      squat: ['Leg Press', 'Walking Lunges']
    },
    meta: {
      ohp: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
      dead: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
      bench: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
      squat: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }]
    },
    sci: { scheme: 'strength', template: 'back1' },
    history: [],
    completion: {}
  };

  let S = (() => {
    try {
      return Object.assign({}, defaultState, JSON.parse(localStorage.getItem(stateKey) || '{}'));
    } catch (_) {
      return { ...defaultState };
    }
  })();

  function saveState() {
    try {
      localStorage.setItem(stateKey, JSON.stringify(S));
    } catch (e) {
      showToast('Failed to save', 'error');
    }
  }

  function ensureMeta() {
    if (!S.meta) {
      S.meta = {
        ohp: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
        dead: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
        bench: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }],
        squat: [{ sets: 3, reps: 10, rpe: 8, notes: '' }, { sets: 3, reps: 12, rpe: 8, notes: '' }]
      };
    }
  }

  function getAccMeta(d, i) {
    ensureMeta();
    return S.meta[d][i];
  }

  function setAccMeta(d, i, f, v) {
    ensureMeta();
    S.meta[d][i][f] = v;
    saveState();
  }

  function accStr(d) {
    ensureMeta();
    const n = (S.acc?.[d] || []);
    return n.map((nm, i) => nm ? `${nm} (${S.meta[d][i].sets}×${S.meta[d][i].reps} @ RPE${S.meta[d][i].rpe}${S.meta[d][i].notes ? ' — ' + S.meta[d][i].notes : ''})` : '').filter(Boolean).join(' + ');
  }

  // Plate calculator
  function calculatePlates(w) {
    const bar = 45;
    const perSide = (w - bar) / 2;
    if (perSide <= 0) return '<span class="muted">Bar only</span>';
    const plates = [
      { w: 45, c: 0, cls: 'p45' },
      { w: 25, c: 0, cls: 'p25' },
      { w: 10, c: 0, cls: 'p10' },
      { w: 5, c: 0, cls: 'p5' },
      { w: 2.5, c: 0, cls: 'p2_5' }
    ];
    let rem = perSide;
    plates.forEach(p => {
      p.c = Math.floor(rem / p.w);
      rem -= p.c * p.w;
    });
    const html = plates.filter(p => p.c > 0).map(p => `<span class="plate ${p.cls}">${p.c}×${p.w}</span>`).join('');
    return `<div class="plate-calc">${html} <span class="muted">(per side)</span></div>`;
  }

  // 1RM calculator
  function calc1RM(tm) {
    return Math.round(tm / 0.9);
  }

  // Number input with steppers
  function createNumberInput(cfg) {
    const { value, min = 0, max = 9999, step = 5, onChange, label: lbl } = cfg;
    const wrap = el('div', { class: 'number-input-group' });
    const inp = el('input', {
      type: 'number',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(value),
      'aria-label': lbl || 'Number'
    });
    const stepper = el('div', { class: 'stepper' });
    const incBtn = el('button', { type: 'button', 'aria-label': 'Increment' }, '▲');
    const decBtn = el('button', { type: 'button', 'aria-label': 'Decrement' }, '▼');

    const update = v => {
      const val = Math.max(min, Math.min(max, v));
      inp.value = val;
      if (onChange) onChange(val);
    };

    incBtn.addEventListener('click', () => update(parseFloat(inp.value) + step));
    decBtn.addEventListener('click', () => update(parseFloat(inp.value) - step));
    inp.addEventListener('input', () => {
      const v = parseFloat(inp.value) || 0;
      if (v >= min && v <= max && onChange) onChange(v);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        update(parseFloat(inp.value) + step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        update(parseFloat(inp.value) - step);
      }
    });

    stepper.appendChild(incBtn);
    stepper.appendChild(decBtn);
    wrap.appendChild(inp);
    wrap.appendChild(stepper);
    return wrap;
  }

  // Tooltip
  function createTooltip(txt, tip) {
    const span = el('span', { class: 'tooltip' }, txt);
    const tipText = el('span', { class: 'tooltiptext' }, tip);
    span.appendChild(tipText);
    return span;
  }

  // Rest Timer
  let timerInterval = null;
  let timerSeconds = 0;

  window.openTimerModal = function() {
    openModal('Rest Timer', `
      <div>
        <label>Rest Time (seconds)</label>
        <div style="display:flex;gap:8px;margin:12px 0;flex-wrap:wrap">
          <button onclick="window.setTimer(60)">60s</button>
          <button onclick="window.setTimer(90)">90s</button>
          <button onclick="window.setTimer(120)">2min</button>
          <button onclick="window.setTimer(180)">3min</button>
          <button onclick="window.setTimer(300)">5min</button>
        </div>
        <div class="timer-display" id="timer-display">0:00</div>
        <div style="display:flex;gap:8px;justify-content:center">
          <button onclick="window.startTimer()">Start</button>
          <button onclick="window.pauseTimer()">Pause</button>
          <button onclick="window.resetTimer()">Reset</button>
        </div>
      </div>
    `);
  };

  window.setTimer = function(s) {
    timerSeconds = s;
    updateTimerDisplay();
  };

  window.startTimer = function() {
    if (timerInterval) return;
    if (timerSeconds === 0) timerSeconds = 90;

    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();

      if (timerSeconds === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        if (Notification.permission === 'granted') {
          new Notification('Rest Timer Complete!', {
            body: 'Time for next set',
            icon: './icons/icon-192.png'
          });
        }
        showToast('Rest complete!', 'success');
      }
    }, 1000);
  };

  window.pauseTimer = function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  window.resetTimer = function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSeconds = 0;
    updateTimerDisplay();
  };

  function updateTimerDisplay() {
    const d = $('#timer-display');
    if (!d) return;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    d.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }

  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => Notification.requestPermission(), 5000);
  }

  // Completion tracking
  function toggleSetCompletion(pid, eid, si) {
    const k = `${pid}_${eid}_${si}`;
    if (!S.completion) S.completion = {};
    S.completion[k] = !S.completion[k];
    saveState();
    renderCurrentProgram();
  }

  function isSetComplete(pid, eid, si) {
    const k = `${pid}_${eid}_${si}`;
    return S.completion?.[k] || false;
  }

  function getWorkoutProgress(pid) {
    if (!S.completion) return 0;
    const keys = Object.keys(S.completion).filter(k => k.startsWith(pid));
    if (keys.length === 0) return 0;
    const comp = keys.filter(k => S.completion[k]).length;
    return Math.round((comp / keys.length) * 100);
  }

  function saveWorkoutToHistory() {
    if (!S.history) S.history = [];
    const today = new Date().toISOString().split('T')[0];
    S.history.unshift({
      date: today,
      program: S.program,
      week: S.week,
      tm: { ...S.tm },
      completion: { ...S.completion }
    });
    if (S.history.length > 50) S.history = S.history.slice(0, 50);
    S.completion = {};
    saveState();
    showToast('Workout saved!', 'success');
    renderHistory();
  }

  function renderHistory() {
    const hs = $('#history-section');
    const hl = $('#history-list');
    if (!S.history || S.history.length === 0) {
      hs.style.display = 'none';
      return;
    }
    hs.style.display = 'block';
    hl.innerHTML = S.history.slice(0, 10).map(w => `
      <div style="padding:12px;background:var(--panel);border-radius:10px;margin:8px 0">
        <strong>${w.date}</strong> — ${w.program === 'science' ? 'Science-Based' : '5/3/1 BBB'} Week ${w.week}<br>
        <span class="muted" style="font-size:12px">Squat: ${w.tm.squat} | Bench: ${w.tm.bench} | Dead: ${w.tm.dead} | OHP: ${w.tm.ohp}</span>
      </div>
    `).join('');
  }

  // Science templates
  const SCI_TEMPLATES = {
    back1: {
      name: 'Back - Workout 1',
      type: 'pull',
      rows: [
        ['Scap Pull-Down Primer', '1-2 × 10-15 (submaximal)', ''],
        ['Seated Cable Row (Wide Elbows)', '2-3 × 6-8 (to form failure)', ''],
        ['Narrow-Grip Lat Pulldown', '2-3 × 10-12 (to failure + partials)', ''],
        ['Straight-Arm Pushdown', '2-3 × 8-10 (to eccentric failure)', ''],
        ['One-and-a-Half Rep DB Pullover Ladder', '1 × to failure', ''],
        ['Banded/Bodyweight Pull-Up', '1 × to failure (+ partials)', '']
      ]
    },
    back2: {
      name: 'Back - Workout 2',
      type: 'pull',
      rows: [
        ['Face Pull (Primer)', '2 × submaximal', ''],
        ['Barbell Row or Chest-Supported Row', '2-3 × 6-8 (to form failure)', ''],
        ['Wide-Grip Pulldown', '2-3 × 10-12 (to failure + partials)', ''],
        ['Dumbbell High Pull', '2-3 × 8-10 (to form failure)', ''],
        ['One-and-a-Half Rep High Cable Row Ladder', '1 × to failure/arm', ''],
        ['Inverted Row', '1 × to failure (+ partials)', '']
      ]
    },
    chest1: {
      name: 'Chest - Workout 1',
      type: 'push',
      rows: [
        ['Banded External Rotation (Primer)', '1-2 × submaximal', ''],
        ['Incline DB Bench Press (Thumbs Up)', '3 × 5-8', ''],
        ['Cable Crossover', '3 × 10-12 (to failure + partials)', ''],
        ['DB Floor Fly (Mechanical Drop Set)', '2-3 × 8-10 (to eccentric failure)', ''],
        ['Deficit One-and-a-Half Rep Push-Up Ladder', '1 × to failure', ''],
        ['Bodyweight Dip', '1 × to failure (+ partials)', '']
      ]
    },
    chest2: {
      name: 'Chest - Workout 2',
      type: 'push',
      rows: [
        ['Band Pull-Apart (Primer)', '1-2 × submaximal', ''],
        ['Dumbbell Bench Press', '3 × 5-8', ''],
        ['High-to-Low Cable Crossover', '3 × 10-12 (to failure + partials)', ''],
        ['Incline Cable Press', '2-3 ×