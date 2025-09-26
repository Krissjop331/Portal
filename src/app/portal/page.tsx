/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Plan = { id: string; name: string; hours: number; price: number };

export default function PortalPage() {
  const params = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([
    { id: 'p1', name: '1 час', hours: 1, price: 300 },
    { id: 'p3', name: '3 часа', hours: 3, price: 700 },
    { id: 'p8', name: '8 часов', hours: 8, price: 1200 },
    { id: 'p24', name: '24 часа', hours: 24, price: 2000 },
  ]);

  const clientMac = useMemo(() => params.get('clientMac') ?? '', [params]);
  const ssid = useMemo(() => params.get('ssid') ?? '', [params]);
  const apMac = useMemo(() => params.get('apMac') ?? '', [params]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function pay(plan: Plan) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/payments/create`, {
        planId: plan.id,
        meta: { clientMac, ssid, apMac },
      });
      // на этапе стаба просто редиректим на "квитанцию"
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
        <p className="text-sm text-gray-600">MAC устройства: {clientMac || 'неизвестно'}</p>

        <h2 className="mt-6 text-lg font-medium">Выберите тариф</h2>
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
