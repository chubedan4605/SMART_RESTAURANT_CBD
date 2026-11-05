import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { X, Users, Armchair } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { tableApi } from "../../services/tableApi";
import { Reveal, SectionLabel } from "../../Components/site/primitives";

const Booking = () => {
  const { t } = useTranslation();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort
  const [filters] = useState({
    status: "",
    location: "",
    sort: "name_asc",
  });

  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  // --- HELPER: Group flat API data by Location ---
  const groupTablesByLocation = (tablesData) => {
    if (!Array.isArray(tablesData)) return [];

    const grouped = tablesData.reduce((acc, table) => {
      const locationName = table.location || t("table.booking.otherArea");

      if (!acc[locationName]) {
        acc[locationName] = [];
      }
      acc[locationName].push(table);
      return acc;
    }, {});

    return Object.keys(grouped).map((key) => ({
      name: key,
      tables: grouped[key],
    }));
  };

  useEffect(() => {
    let mounted = true;

    const fetchTables = async () => {
      setLoading(true);
      try {
        const data = await tableApi.getTables(filters);
        if (!mounted) return;

        const processedData = groupTablesByLocation(
          Array.isArray(data) ? data : [],
        );
        setAreas(processedData);
      } catch (err) {
        console.error(err);
        toast.error(err?.message || t("table.booking.loadError"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTables();
    return () => {
      mounted = false;
    };
  }, [filters, t]);

  const handleTableClick = (table) => {
    const isOccupied =
      table.status === "occupied" || table.current_session_id != null;
    if (isOccupied) {
      toast.warning(
        t("table.booking.tableOccupied", { table: table.table_number }),
      );
      return;
    }
    setSelectedTable(table);
  };

  const handleSimulateScan = () => {
    if (selectedTable) {
      navigate(`/scan/${selectedTable.id}?qrToken=${selectedTable.qr_token}`);
    }
  };

  const getSeats = (table) => {
    return table.capacity ?? table.seats ?? 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-luxe text-muted-foreground">{t("table.booking.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-12 pb-24 px-4 font-sans selection:bg-gold/30 selection:text-gold">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <Reveal className="mb-10 text-center flex flex-col items-center">
          <SectionLabel align="center" className="mb-4">
            Floor Plan & Table Map
          </SectionLabel>
          <h1 className="text-3xl sm:text-4xl font-serif text-foreground mb-3 font-medium">
            {t("table.booking.title")}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md font-light leading-relaxed">
            {t("table.booking.subtitle")}
          </p>
        </Reveal>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-xs font-sans uppercase tracking-luxe">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-card border border-border" />
            <span className="text-muted-foreground">
              {t("table.booking.available")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gold/20 border border-gold" />
            <span className="text-gold font-semibold">
              {t("table.booking.occupied")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-destructive/20 border border-destructive/50" />
            <span className="text-destructive font-semibold">{t("table.booking.reserved")}</span>
          </div>
        </div>

        {/* Areas & Tables Content */}
        <div className="space-y-12">
          {areas.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 font-sans">
              {t("table.booking.noTables")}
            </div>
          ) : (
            areas.map((area) => (
              <Reveal key={area.name}>
                <h2 className="font-serif text-2xl text-foreground mb-4 border-l-2 border-gold pl-3 font-medium">
                  {area.name}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {(area.tables || []).map((table) => {
                    const hasActiveSession = table.current_session_id != null;
                    const isOccupied =
                      table.status === "occupied" || hasActiveSession;
                    const isReserved = table.status === "reserved";
                    const isAvailable =
                      (table.status === "available" ||
                        table.status === "active") &&
                      !hasActiveSession;

                    return (
                      <button
                        type="button"
                        key={table.id}
                        onClick={() => handleTableClick(table)}
                        disabled={isOccupied || isReserved}
                        className={`
                          relative group p-5 rounded-none border transition-all duration-300
                          flex flex-col items-center justify-center gap-2 min-h-32 text-center
                          ${
                            isAvailable
                              ? "bg-card border-border hover:border-gold/60 hover:shadow-lg cursor-pointer"
                              : ""
                          }
                          ${
                            isOccupied
                              ? "bg-gold/10 border-gold/30 cursor-not-allowed"
                              : ""
                          }
                          ${
                            isReserved
                              ? "bg-destructive/10 border-destructive/30 opacity-60 cursor-not-allowed"
                              : ""
                          }
                        `}
                      >
                        <Armchair
                          size={28}
                          className={`
                            ${
                              isAvailable
                                ? "text-muted-foreground group-hover:text-gold transition-colors"
                                : ""
                            }
                            ${isOccupied ? "text-gold" : ""}
                            ${isReserved ? "text-destructive" : ""}
                          `}
                        />

                        <span
                          className={`font-serif text-2xl font-medium ${
                            isOccupied ? "text-gold" : "text-foreground"
                          }`}
                        >
                          {table.table_number}
                        </span>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
                          <Users size={12} className="text-gold" />
                          <span>
                            {t("table.booking.seats", {
                              count: getSeats(table),
                            })}
                          </span>
                        </div>

                        {isOccupied && (
                          <>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold animate-pulse" />
                            <span className="text-[9px] text-gold font-sans font-semibold uppercase tracking-luxe mt-1">
                              {t("table.booking.occupied")}
                            </span>
                          </>
                        )}

                        {isReserved && (
                          <span className="text-[9px] text-destructive font-sans font-semibold uppercase tracking-luxe mt-1">
                            {t("table.booking.reserved")}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>

      {/* QR MODAL */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border rounded-none p-6 w-full max-w-sm relative shadow-2xl">
            <button
              onClick={() => setSelectedTable(null)}
              aria-label="Close"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-luxe text-gold font-semibold mb-1">
                Bàn Được Chọn
              </p>
              <h3 className="font-serif text-3xl font-medium text-foreground mb-1">
                Bàn {selectedTable.table_number}
              </h3>
              <p className="text-muted-foreground text-xs font-light mb-6">
                {t("table.booking.scanToOrder")}
              </p>

              <div className="bg-white p-4 rounded-none inline-block mb-6 mx-auto border border-gold/40 shadow-sm">
                <QRCode
                  value={`${window.location.origin}/scan/${selectedTable.id}?qrToken=${selectedTable.qr_token}`}
                  size={190}
                  level="H"
                />
              </div>

              <p className="text-muted-foreground text-xs mb-6 px-4 font-light leading-relaxed">
                {t("table.booking.scanInstruction")}
              </p>

              <button
                onClick={handleSimulateScan}
                className="w-full min-h-11 py-3.5 bg-gold hover:bg-gold-soft text-ink font-sans text-xs uppercase tracking-luxe font-semibold rounded-none transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {t("table.booking.enterNow")} &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
