/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export const dynamic = 'force-dynamic';

type Plan = { id: string; name: string; hours: number; price: number };

function PortalInner() {
  const params = useSearchParams();

  const clientMac = useMemo(() => params.get('clientMac') ?? '', [params]);
  const ssid = useMemo(() => params.get('ssid') ?? '', [params]);
  const apMac = useMemo(() => params.get('apMac') ?? '', [params]);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Plan[]>(`${process.env.NEXT_PUBLIC_BACKEND}/plans`, {
          headers: { 'Cache-Control': 'no-store' },
        });
        setPlans(res.data);
      } catch (e) {
        setMsg('Не удалось загрузить тарифы');
      }
    })();
  }, []);

  async function pay(plan: Plan) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/payments/create`, {
        planId: plan.id,
        meta: { clientMac, ssid, apMac },
      });
      if (res.data?.paymentUrl) window.location.href = res.data.paymentUrl;
      else setMsg('Создан платёж (тест). Ждём вебхук…');
    } catch (e: any) {
      setMsg(e?.response?.data?.message || 'Ошибка создания платежа');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-gray-50 text-gray-900">
      <section className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-semibold">Гостевой Wi-Fi</h1>
        <p className="mt-2 text-sm text-gray-600">SSID: {ssid || 'неизвестно'}</p>
        <p className="text-sm text-gray-600">MAC: {clientMac || 'неизвестно'}</p>

        <h2 className="mt-6 text-lg font-medium">Выберите тариф</h2>

        {!plans.length && !msg && (
          <div className="mt-4 text-sm text-gray-600">Загрузка тарифов…</div>
        )}

        <ul className="mt-3 space-y-3">
          {plans.map((p) => (
            <li key={p.id} className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">{p.hours} ч</div>
              </div>
              <button
                onClick={() => pay(p)}
                disabled={loading}
                className="rounded-lg px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Оплатить {p.price}₸
              </button>
            </li>
          ))}
        </ul>

        {msg && <div className="mt-4 text-sm text-amber-700">{msg}</div>}
      </section>
    </main>
  );
}

function Loading() {
  return (
    <main className="min-h-dvh grid place-items-center">
      <div className="text-gray-600">Загрузка…</div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PortalInner />
    </Suspense>
  );
}
