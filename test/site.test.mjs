import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { services, validateBooking, todayInDubai } from '../dist/data.js';

const valid = { name: 'Demo Visitor', service: 'skin-fade', barber: 'Amir', date: '2026-11-02' };
test('all eight services have the exact consistent concept prices and durations', () => {
  assert.deepEqual(services.map(s=>[s.price,s.duration]), [[120,40],[140,45],[70,25],[90,30],[180,65],[80,25],[50,20],[100,30]]);
  assert.equal(new Set(services.map(s=>s.id)).size,8);
});
test('booking works without a phone; required fields and past dates are validated', () => {
  assert.deepEqual(validateBooking(valid,'2026-11-01'),{});
  assert.deepEqual(validateBooking({...valid,date:''},'2026-11-01'),{});
  assert.deepEqual(Object.keys(validateBooking({name:' ',service:'fake',barber:'Fake',date:'2026-10-31'},'2026-11-01')),['name','service','barber','date']);
  assert.ok(validateBooking({...valid,date:'2026-02-30'},'2026-01-01').date);
  assert.equal(todayInDubai(new Date('2026-11-01T21:00:00Z')), '2026-11-02');
});
test('all static routes, service images, fonts and concept notices are shipped', async () => {
  for (const path of ['index.html','services/index.html','booking/index.html']) {
    const html=await readFile(`dist/${path}`,'utf8');
    assert.ok(html.includes('FICTIONAL BUSINESS'));
    assert.ok(html.includes('No real appointments are accepted.'));
    assert.ok(html.includes('href="/curb-barber-studio/#about"') && html.includes('href="/curb-barber-studio/#location"'));
    assert.ok(!html.includes('tel:') && !html.includes('wa.me'));
  }
  for (const service of services) await access(`dist/assets/services/${service.image}`);
  for (const font of ['BebasNeue-Regular.ttf','Manrope-Variable.ttf']) await access(`dist/assets/fonts/${font}`);
});
test('booking never sends or stores personal details', async () => {
  const js=await readFile('dist/app.js','utf8');
  assert.ok(js.includes('event.preventDefault()'));
  assert.ok(js.includes('window.location.assign(whatsappUrl)'));
  assert.ok(!/fetch\(|XMLHttpRequest|localStorage|sessionStorage|sendBeacon|FormData|wa\.me/.test(js));
  assert.ok(js.includes('form.reset()'));
  const html = await readFile('dist/booking/index.html','utf8');
  assert.ok(!html.includes('id="phone"') && !html.includes('type="tel"'));
  assert.ok(html.includes('/curb-barber-studio/app.js?v='));
});

test('nearby pointer motion stays subtle and keeps one connected cable', async () => {
  const { heroMotion } = await import('../dist/hero-motion.js');
  const rest = heroMotion();
  assert.deepEqual(rest.scissors, { x: -0, y: -0 });
  assert.deepEqual(rest.clipper, { x: -0, y: -0 });
  assert.equal(heroMotion(10000,10000).path, rest.path);
  const near = heroMotion(180,170);
  assert.ok(near.scissors.x > 0);
  assert.equal(near.clipper.x, -0);
  for (let x=-200; x<=800; x+=50) for(let y=-200; y<=600; y+=50) {
    const state=heroMotion(x,y);
    for(const tool of [state.scissors,state.clipper]) {
      assert.ok(Math.abs(tool.x)<=6.61 && Math.abs(tool.y)<=6.61);
      assert.ok(Number.isFinite(tool.x) && Number.isFinite(tool.y));
    }
    assert.ok(state.path.startsWith(`M${118+state.scissors.x} ${156+state.scissors.y} C`));
    assert.ok(state.path.endsWith(`${524+state.clipper.x} ${268+state.clipper.y}`));
  }
});
