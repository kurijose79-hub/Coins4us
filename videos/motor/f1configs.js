const L = {
  gro: { main: '#2a2a2c', accent: '#d0021b', helmet: '#f2f2f2', num: 8, tyre: '#ffd200' },
  kvy: { main: '#f2f2f2', accent: '#14213d', helmet: '#ff6a00', num: 26 },
  ham: { main: '#1b1b1b', accent: '#00d2be', helmet: '#ffd200', num: 44, tyre: '#ffffff' },
  ver: { main: '#1e2a5a', accent: '#e10600', helmet: '#e10600', num: 33, tyre: '#ffffff' },
  fer: { main: '#c00000', accent: '#ffd400', helmet: '#ffffff', num: 16 },
  mcl: { main: '#ff8000', accent: '#1e88e5', helmet: '#ffd200', num: 4 },
  ren: { main: '#ffd200', accent: '#111111', helmet: '#1e88e5', num: 3 },
  rp: { main: '#f596c8', accent: '#1e3a8a', helmet: '#ffffff', num: 11 },
  wil: { main: '#0a59c7', accent: '#ffffff', helmet: '#ffffff', num: 6 },
  alf: { main: '#900000', accent: '#ffffff', helmet: '#ffd200', num: 7 },
};
const PK = [['ham', 'modern', L.ham], ['ver', 'modern', L.ver], ['fer', 'modern', L.fer], ['mcl', 'modern', L.mcl], ['ren', 'modern', L.ren], ['rp', 'modern', L.rp], ['wil', 'modern', L.wil], ['alf', 'modern', L.alf]];
const dup = (id, base, n) => [id, 'modern', { ...base, num: n }];
const RB = '#1e2a5a', MB = '#00d2be';
export const F1 = {
  f1a: {
    env: 'bahrain', label: 'GP BAHRÉIN · 29 NOV 2020', accent: '#e10600', locs: { start: [0, 0], crash: [-40, 108], t1: [262, 50] },
    cars: [['gro', 'modern', L.gro], ['kvy', 'modern', L.kvy], ['haloCar', 'modern', { ...L.gro, halo: '#2a2a2a' }], ...PK, dup('ham2', L.ham, 77), dup('ver2', L.ver, 11), dup('fer2', L.fer, 5), dup('mcl2', L.mcl, 55), dup('ren2', L.ren, 31), dup('rp2', L.rp, 18), dup('wil2', L.wil, 63), dup('alf2', L.alf, 99)],
    pack: ['ham', 'ham2', 'ver', 'ver2', 'fer', 'fer2', 'mcl', 'mcl2', 'ren', 'ren2', 'rp', 'rp2', 'alf', 'kvy', 'wil', 'wil2', 'alf2'],
    crowd: ['#c8102e', '#ffffff', '#222', '#d4af37'],
    shots: [
      { type: 'aerial', at: 'start', pack: 17, v: 55, big: 'BAHRÉIN\n2020', lap: 'VUELTA 1/57', flag: 'VERDE', a0: 2.2, a1: 3.0, r0: 160, r1: 60, h0: 110, h1: 25 },
      { type: 'packChase', at: 'crash', n: 13, hero: 'gro', victim: 'kvy', heroRow: 7, v: 61, lat0: 2.6, lat1: 5.0, touchAt: 0.62, big: [[0, null], [0.3, '221 KM/H']], lap: 'VUELTA 1/57', flag: 'VERDE', speedLines: 0.8, shake: 0.6, shakeAt: 0.66 },
      { type: 'crash', hero: 'gro', at: 'crash', cam: 'side', tImp: 0.42, slow: 0.45, shake: 2.2, shakeAt: 0.45, redFlash: 0.44, big: [[0, null], [0.5, '67 G']], lap: 'VUELTA 1/57', flag: [[0, 'VERDE'], [0.45, 'ROJA']] },
      { type: 'crash', hero: 'gro', at: 'crash', cam: 'heli', tImp: -0.25, slow: 0.6, a0: 2.0, a1: 2.6, lap: 'VUELTA 1/57', flag: 'ROJA', redFlash: 0.05, shake: 1, shakeAt: 0.1 },
      { type: 'crash', hero: 'gro', at: 'crash', cam: 'close', tImp: -2, slow: 0.5, a0: -0.9, a1: -0.3, big: [[0, '0:10'], [0.33, '0:15'], [0.66, '0:20']], bigSize: 200, lap: 'VUELTA 1/57', flag: 'ROJA' },
      { type: 'crash', hero: 'gro', at: 'crash', cam: 'close', tImp: -3, slow: 0.5, a0: 0.2, a1: -0.2, driverOut: 0.2, fireLevel: 0.8, big: [[0, null], [0.62, '¡ESTÁ VIVO!']], bigSize: 130, lap: 'VUELTA 1/57', flag: 'ROJA' },
      { type: 'crash', hero: 'gro', at: 'crash', cam: 'close', tImp: -6, slow: 0.5, a0: -0.4, a1: 0.1, fireLevel: 0.2, burnt: true, big: '28 SEGUNDOS', bigSize: 130, lap: 'VUELTA 1/57', flag: 'ROJA' },
      { type: 'halo', car: 'haloCar', glow: '#ffb000', big: [[0, null], [0.15, 'EL HALO']], lap: 'SEGURIDAD', flag: null },
      { type: 'outro', at: 't1', pack: 10, r0: 35, r1: 60, h0: 20, h1: 40, cta: '¿HABRÍAS VUELTO A CORRER?' },
    ],
  },
  f1b: {
    env: 'retro', label: 'HISTORIA DE LA F1', accent: '#c8102e', locs: { start: [0, 0], gs: [60, 0], line: [-210, 0] }, grade: 'sepia(0.55) contrast(1.08) saturate(0.9)', grain: true,
    crowd: ['#3a4a6a', '#6a4a3a', '#ddd', '#555'],
    cars: [['far', '1950', { main: '#b0141c', num: 2 }], ['r2', '1950', { main: '#1d5c2e', num: 12 }], ['r3', '1950', { main: '#1e4fa0', num: 18 }], ['r4', '1950', { main: '#b8b8b8', num: 10 }], ['r5', '1950', { main: '#b0141c', num: 3 }], ['r6', '1950', { main: '#e8dcb8', num: 21 }],
      ['c70', '1970', { main: '#f4f4f4', accent: '#d0021b', helmet: '#ffd200', num: 5 }], ['c80', '1980', { main: '#f4f4f4', accent: '#1d3f8f', helmet: '#ffd200', num: 12 }], ['mod', 'modern', { main: '#e10600', accent: '#111111', helmet: '#ffd200', num: 1, tyre: '#e10600' }]],
    pack: ['far', 'r5', 'r2', 'r4', 'r3', 'r6'],
    shots: [
      { type: 'aerial', at: 'start', pack: 6, v: 40, big: '¿SABÍAS\nQUE…?', lap: 'ORÍGENES', a0: 0.5, a1: 1.3, r0: 200, r1: 70, h0: 150, h1: 30 },
      { type: 'lineupGrid', at: 'start', cars: [['far', 0, -2.5], ['r5', -1, 2.5], ['r2', -9, -2.5], ['r4', -10, 2.5], ['r3', -18, -2.5], ['r6', -19, 2.5]], x0: -48, x1: -30, side: -6, h: 1.8, lookAhead: 30, big: '13·05·1950', bigSize: 150, lap: 'SILVERSTONE' },
      { type: 'crowdStand', at: 'gs', cars: [['far', -60, -1, 40], ['r5', -80, 1.5, 40], ['r2', -100, -1, 40]], big: [[0, null], [0.2, '1ª CARRERA\nCAMPEONATO MUNDIAL']], bigSize: 110, lap: 'SILVERSTONE' },
      { type: 'orbitCar', at: 'start', car: 'far', a0: 0.5, a1: 2.2, r0: 6, r1: 4.6, h0: 1.8, h1: 1.3, callouts: [['MOTOR DELANTERO', 0, 0.75, 1.5, 0.08], ['RUEDAS FINAS', 0.72, 0.85, -1.3, 0.38], ['SIN CINTURÓN', 0, 1.25, -0.35, 0.68]], lap: '1950', grade: 'sepia(0.4) contrast(1.05)' },
      { type: 'race', at: 'start', cars: [['far', -70, 0, 34], ['r5', -105, 1.5, 33], ['r2', -125, -1.5, 33]], focus: 'far', cam: 'trackside', camAt: 'start', camLat: -11, camH: 1.8, fov: 38, flagAt: 'start', big: [[0, null], [0.6, 'GANADOR:\nG. FARINA']], bigSize: 120, lap: 'META' },
      { type: 'blueprint', car: 'mod', big: 'FÓRMULA\n= REGLAMENTO', bigSize: 140, lap: 'EL NOMBRE', grade: 'none', grain: false },
      { type: 'orbitCar', at: 'start', car: 'c70', car2: 'c80', swapAt: 0.5, a0: 0.4, a1: 2.6, r0: 11, r1: 8, h0: 1.6, h1: 1.4, big: [[0, 'AÑOS 70'], [0.5, 'AÑOS 80']], bigSize: 150, lap: [[0, 'ALERONES'], [0.5, 'TURBO +1000 HP']], grade: 'sepia(0.15) saturate(1.1)', grain: false },
      { type: 'launch', at: 'start', car: 'mod', go: 0.25, lights: true, lightsRed: true, big: [[0, null], [0.27, '{speed} KM/H']], bigSize: 150, lap: 'HOY', speedLines: 1, slFrom: 0.3, grade: 'none', grain: false, vib: 1 },
      { type: 'outro', at: 'line', cars: [['far', 0, -7.5], ['c70', 0, -2.5], ['c80', 0, 2.5], ['mod', 0, 7.5]], callouts: [['1950', 'far'], ['70s', 'c70'], ['80s', 'c80'], ['HOY', 'mod']], r0: 18, r1: 26, h0: 6, h1: 12, cta: '¿QUÉ ÉPOCA TE GUSTA MÁS?', grade: 'none', grain: false },
    ],
  },
  f1c: {
    env: 'abudhabi', label: 'GP ABU DABI · 12 DIC 2021', accent: '#e10600', locs: { start: [0, 0], back: [-60, 115], t5: [118, 100], latifi: [-120, 124], fin: [-200, 0] },
    crowd: ['#1e2a5a', '#00d2be', '#ff8000', '#ffffff', '#e10600'],
    cars: [['ham', 'modern', L.ham], ['ver', 'modern', { ...L.ver, tyre: '#e10600' }], ['lat', 'modern', L.wil], ['sc', 'sc', { main: '#5f6a72' }], ['fer', 'modern', L.fer], ['mcl', 'modern', L.mcl], ['alf', 'modern', L.alf], ['rp', 'modern', L.rp]],
    shots: [
      { type: 'aerial', at: 'start', cars: [['ham', 30, -1], ['ver', 18, 1.5], ['fer', 4, -1], ['mcl', -8, 1], ['alf', -20, -1]], v: 60, big: 'ABU DABI\n2021', lap: 'VUELTA 1/58', flag: 'VERDE', a0: 1.0, a1: 1.8, r0: 190, r1: 60, h0: 120, h1: 25 },
      { type: 'lineupGrid', at: 'start', cars: [['ver', 0, 2.5], ['ham', -8, -2.5], ['fer', -16, 2.5], ['mcl', -24, -2.5]], x0: -42, x1: -26, side: -6, h: 1.6, lookAhead: 28, lights: 0.95, lightsRed: true, callouts: [['369.5 PTS', 'ver', 0.15], ['369.5 PTS', 'ham', 0.35]], big: [[0, null], [0.6, 'EMPATADOS']], lap: 'PARRILLA', tower: [[1, 'VER', RB, '369.5'], [2, 'HAM', MB, '369.5']] },
      { type: 'race', at: 'back', cars: [['ham', 0, 0, 70]], focus: 'ham', cam: 'chase', back: 8, side: -1.5, speedLines: 0.6, big: [[0, null], [0.45, '+11 SEG']], lap: 'VUELTA 50/58', flag: 'VERDE', tower: [[1, 'HAM', MB, 'LÍDER'], [2, 'VER', RB, '+11.0']] },
      { type: 'race', at: 'latifi', cars: [['mcl', -60, 2, 50]], crashCar: 'lat', crashAt: 0.12, crashDs: -20, focus: 'lat', cam: 'trackside', camAt: 'latifi', camLat: 12, camH: 3, fov: 44, big: [[0, null], [0.55, 'SAFETY CAR']], bigSize: 140, lap: 'VUELTA 53/58', flag: [[0, 'AMARILLA'], [0.55, 'SC']], shake: 0.8, shakeAt: 0.3 },
      { type: 'race', at: 'start', cars: [], pit: 'ver', crewCol: RB, focus: 'ver', cam: 'pit', big: [[0, null], [0.62, 'NEUMÁTICOS\nNUEVOS']], bigSize: 120, lap: 'VUELTA 53/58', flag: 'SC', tower: [[1, 'HAM', MB, 'LÍDER'], [2, 'VER', RB, 'BOXES']] },
      { type: 'race', at: 'back', cars: [['ham', 14, -0.5, 32], ['ver', 5, 0.5, 32]], sc: ['sc', 32, 32, 0], focus: 'ver', cam: 'heli', big: [[0, null], [0.35, 'ÚLTIMA\nVUELTA']], bigSize: 140, lap: 'VUELTA 58/58', flag: [[0, 'SC'], [0.7, 'VERDE']], tower: [[1, 'HAM', MB, ''], [2, 'VER', RB, '+0.3']] },
      { type: 'race', at: 't5', cars: [['ham', -40, 1.5, 24], ['ver', -48, 1.5, 28.5, -3.8, [0.1, 0.55]]], focus: 'ver', cam: 'trackside', camAt: 't5', camLat: 13, camH: 2.4, fov: 40, big: 'CURVA 5', lap: 'VUELTA 58/58', flag: 'VERDE', shake: 0.6, shakeAt: 0.55, tower: [[0, [[1, 'HAM', MB, ''], [2, 'VER', RB, '+0.2']]], [0.55, [[1, 'VER', RB, ''], [2, 'HAM', MB, '+0.1']]]] },
      { type: 'race', at: 'fin', cars: [['ver', 0, -1, 68], ['ham', -9, 1.6, 68.5]], focus: 'ver', cam: 'chase', back: 9, side: 2.5, speedLines: 0.8, flagAt: 'start', lap: 'VUELTA 58/58', flag: [[0, 'VERDE'], [0.75, 'META']], tower: [[1, 'VER', RB, ''], [2, 'HAM', MB, '+2.2']] },
      { type: 'donuts', at: 'start', car: 'ver', big: [[0, null], [0.2, 'CAMPEÓN\nDEL MUNDO']], bigSize: 130, lap: 'FINAL', flag: 'META', tower: [[1, 'VER', RB, '395.5'], [2, 'HAM', MB, '387.5']] },
      { type: 'outro', at: 'start', cars: [['ver', 0, -2.5], ['ham', 0, 2.5]], callouts: [['VER', 'ver'], ['HAM', 'ham']], r0: 14, r1: 22, h0: 5, h1: 10, cta: '¿JUSTO O INJUSTO?' },
    ],
  },
};
