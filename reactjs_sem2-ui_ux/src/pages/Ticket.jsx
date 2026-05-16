import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket as TicketIcon, Download, Loader2 } from 'lucide-react';
import { getList, KEYS } from '../utils/storage';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { GlowCard } from '../components/ui/spotlight-card';
import { Button } from '../components/ui/button';
import { ButtonColorful } from '../components/ui/button-colorful';

// ── PDF Download ──────────────────────────────────────────────────────────────
async function downloadTicketAsPDF(ticketRef, filename) {
  // Dynamically import to avoid bundling cost unless needed
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const el = ticketRef.current;
  if (!el) return;

  // Capture the ticket card at 2× resolution for sharpness
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#09090b',   // matches zinc-950
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgW = canvas.width;
  const imgH = canvas.height;

  // A4 proportions — keep ticket aspect ratio centred on page
  const pdfW = 210;    // mm
  const scale = pdfW / (imgW / 2);   // 96 dpi → mm
  const pdfH = (imgH / 2) * scale;

  const pdf = new jsPDF({
    orientation: pdfH > pdfW ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pdfW, Math.max(pdfH + 20, 100)],
  });

  pdf.addImage(imgData, 'PNG', 0, 10, pdfW, pdfH);
  pdf.save(`${filename}.pdf`);
}

export default function Ticket() {
  const { ticketId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [event, setEvent]               = useState(null);
  const [downloading, setDownloading]   = useState(false);
  const ticketRef = useRef(null);

  useEffect(() => {
    const registrations = getList(KEYS.REGISTRATIONS);
    const reg = registrations.find((r) => r.ticketId === ticketId);
    setRegistration(reg || null);

    if (reg) {
      const events = getList(KEYS.EVENTS);
      const found  = events.find((ev) => ev.id === reg.eventId);
      setEvent(found || null);
    }
  }, [ticketId]);

  if (!registration || !event) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center text-slate-500">
          <TicketIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Ticket not found</p>
          <Link to="/" className="text-zinc-600 hover:underline text-sm mt-2 block">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const shortId = ticketId.split('-')[0].toUpperCase();

  async function handleDownload() {
    setDownloading(true);
    try {
      const safeName = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      await downloadTicketAsPDF(ticketRef, `ticket_${safeName}_${shortId}`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Your Ticket</h1>

        {/* ── Ticket card (captured for PDF) ──────────────────────────────── */}
        <div ref={ticketRef}>
          <GlowCard customSize={true} className="bg-zinc-950 border border-white/10 rounded-2xl p-0 overflow-hidden relative">

            {/* Top: event image */}
            <div className="relative">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-40 object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
                <div>
                  <span className="text-xs font-medium bg-zinc-500/20 text-zinc-300 border border-zinc-500/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {event.category}
                  </span>
                  <h2 className="text-white font-bold text-xl mt-2 leading-tight drop-shadow-md">{event.title}</h2>
                </div>
              </div>
            </div>

            {/* Middle: event details */}
            <div className="px-6 py-6 border-b border-dashed border-white/10 grid grid-cols-2 gap-5 relative z-10">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-slate-100 leading-tight">{formatDate(event.date)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{formatTime(event.time)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-slate-100 leading-tight">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Attendee</p>
                  <p className="text-sm font-semibold text-slate-100 leading-tight">{registration.attendeeData.fullName}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{registration.attendeeData.department}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <TicketIcon className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Ticket ID</p>
                  <p className="text-sm font-bold text-zinc-400 leading-tight">{shortId}</p>
                </div>
              </div>
            </div>

            {/* Stub: QR code */}
            <div className="relative px-6 py-8 bg-white/5">
              {/* Notch circles */}
              <div className="absolute -left-3 top-0 -translate-y-1/2 w-6 h-6 bg-black rounded-full border-r border-dashed border-white/10" />
              <div className="absolute -right-3 top-0 -translate-y-1/2 w-6 h-6 bg-black rounded-full border-l border-dashed border-white/10" />

              <div className="flex flex-col items-center gap-4 relative z-10">
                <div className="bg-white p-3 rounded-xl shadow-lg shadow-black/20">
                  <QRCodeSVG value={ticketId} size={140} level="M" includeMargin={false} />
                </div>
                <p className="text-xs text-slate-400 text-center max-w-[200px]">
                  Scan this QR code at the event entrance
                </p>
                <p className="text-xs font-mono text-slate-500 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10">
                  {ticketId}
                </p>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* ── Action buttons ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 mt-8">
          {/* Download PDF */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-full py-3.5 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
              : <><Download className="w-4 h-4" /> Download Ticket as PDF</>
            }
          </button>

          <div className="flex gap-3">
            <Link to="/my-tickets" className="flex-1">
              <Button variant="outline" className="w-full border-white/10 text-slate-300 hover:bg-white/5">
                All Tickets
              </Button>
            </Link>
            <Link to="/home" className="flex-1">
              <ButtonColorful label="Browse Events" className="w-full" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
