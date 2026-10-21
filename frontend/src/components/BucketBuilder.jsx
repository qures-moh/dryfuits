import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Gift,
  MessageCircle,
  Plus,
  Ribbon,
  Sparkles,
  X,
} from "lucide-react";
import { fetchCustomStudio } from "../api";
import { useStore } from "../redux/useStore";

const getId = (item) => String(item?._id || item?.id || "");

const getFillerPrice = (filler) => {
  if (filler?.price !== undefined && filler?.price !== null) {
    return Number(filler.price) || 0;
  }

  if (filler?.pricePer100g) {
    return Number(filler.pricePer100g) * 1.5;
  }

  return 0;
};

const getImageUrl = (image) => {
  if (!image) {
    return "/images/bucket_hamper.jpg";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    const serverUrl =
      import.meta.env.VITE_SERVER_URL ||
      "http://localhost:5000";

    return `${serverUrl}${image}`;
  }

  return image;
};

export const BucketBuilder = ({
  isOpen = true,
  onClose = () => {},
}) => {
  const { formatPrice, showToast } = useStore();

  const [step, setStep] = useState(1);

  const [containers, setContainers] = useState([]);
  const [fillers, setFillers] = useState([]);
  const [ribbons, setRibbons] = useState([]);

  const [selectedContainer, setSelectedContainer] =
    useState(null);

  const [selectedFillers, setSelectedFillers] =
    useState([]);

  const [selectedRibbon, setSelectedRibbon] =
    useState(null);

  const [recipientName, setRecipientName] =
    useState("");

  const [giftMessage, setGiftMessage] = useState(
    "Wishing you abundant health, happiness and prosperity!"
  );

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadDynamicStudio = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const data = await fetchCustomStudio();

        if (!isMounted) return;

        const backendContainers =
          Array.isArray(data?.containers)
            ? data.containers
            : [];

        const backendFillers =
          Array.isArray(data?.fillers)
            ? data.fillers
            : [];

        const backendRibbons =
          Array.isArray(data?.ribbons)
            ? data.ribbons
            : [];

        setContainers(backendContainers);
        setFillers(backendFillers);
        setRibbons(backendRibbons);

        setSelectedContainer(
          backendContainers.length > 0
            ? backendContainers[0]
            : null
        );

        setSelectedFillers(
          backendFillers.length > 0
            ? backendFillers.slice(
                0,
                Math.min(3, backendFillers.length)
              )
            : []
        );

        setSelectedRibbon(
          backendRibbons.length > 0
            ? backendRibbons[0]
            : null
        );
      } catch (error) {
        console.error(
          "Custom Studio API Error:",
          error
        );

        if (!isMounted) return;

        setLoadError(
          "Unable to load Custom Studio data."
        );

        setContainers([]);
        setFillers([]);
        setRibbons([]);

        setSelectedContainer(null);
        setSelectedFillers([]);
        setSelectedRibbon(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDynamicStudio();

    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const containerCost =
    Number(selectedContainer?.price) || 0;

  const fillersCost = selectedFillers.reduce(
    (total, filler) =>
      total + getFillerPrice(filler),
    0
  );

  const ribbonCost =
    Number(
      selectedRibbon?.price ??
        selectedRibbon?.cost ??
        0
    ) || 0;

  const totalPrice =
    containerCost +
    fillersCost +
    ribbonCost;

  const totalWeight = selectedFillers.reduce(
    (total, filler) =>
      total +
      (Number(filler?.weight) || 150),
    0
  );

  const handleToggleFiller = (filler) => {
    const fillerId = getId(filler);

    if (!fillerId) {
      showToast(
        "This dry fruit is missing an ID.",
        "error"
      );
      return;
    }

    const exists = selectedFillers.some(
      (item) => getId(item) === fillerId
    );

    if (exists) {
      if (selectedFillers.length === 1) {
        showToast(
          "Select at least one dry fruit.",
          "error"
        );
        return;
      }

      setSelectedFillers((current) =>
        current.filter(
          (item) => getId(item) !== fillerId
        )
      );

      return;
    }

    if (selectedFillers.length >= 6) {
      showToast(
        "You can select a maximum of 6 dry fruits.",
        "error"
      );
      return;
    }

    setSelectedFillers((current) => [
      ...current,
      filler,
    ]);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!selectedContainer) {
        showToast(
          "Please select a container.",
          "error"
        );
        return false;
      }
    }

    if (step === 2) {
      if (selectedFillers.length < 1) {
        showToast(
          "Please select at least one dry fruit.",
          "error"
        );
        return false;
      }

      if (selectedFillers.length > 6) {
        showToast(
          "You can select a maximum of 6 dry fruits.",
          "error"
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setStep((current) =>
      Math.min(3, current + 1)
    );
  };

  const handlePrevious = () => {
    setStep((current) =>
      Math.max(1, current - 1)
    );
  };

  const handleOrderOnWhatsApp = () => {
    if (!selectedContainer) {
      showToast(
        "Please select a container.",
        "error"
      );
      setStep(1);
      return;
    }

    if (selectedFillers.length < 1) {
      showToast(
        "Please select at least one dry fruit.",
        "error"
      );
      setStep(2);
      return;
    }

    if (!selectedRibbon) {
      showToast(
        "Please select a ribbon.",
        "error"
      );
      setStep(3);
      return;
    }

    const message = [
      "Hello Golden Harvest!",
      "",
      "I would like to enquire about my custom dry fruit gift bucket.",
      "",
      `Container: ${
        selectedContainer.name
      } (${formatPrice(containerCost)})`,
      `Dry Fruits: ${
        selectedFillers
          .map((item) => item.name)
          .join(", ")
      }`,
      `Ribbon: ${
        selectedRibbon.name
      }`,
      `Recipient: ${
        recipientName.trim() ||
        "Self / Recipient"
      }`,
      `Gift Note: ${
        giftMessage.trim() ||
        "No message added"
      }`,
      `Estimated Total: ${formatPrice(
        totalPrice
      )}`,
      `Estimated Net Weight: ${totalWeight}g`,
      "",
      "Please confirm availability, final pricing, and dispatch options.",
    ].join("\n");

    try {
      confetti({
        particleCount: 55,
        spread: 55,
        origin: {
          y: 0.65,
        },
      });
    } catch {}

    showToast(
      "Opening WhatsApp for your enquiry..."
    );

    const whatsappNumber =
      "919179598991";

    const url =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message);

    const whatsappWindow = window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      window.location.href = url;
      return;
    }

    onClose();
  };

  const steps = [
    {
      number: 1,
      label: "Container",
    },
    {
      number: 2,
      label: "Dry Fruits",
    },
    {
      number: 3,
      label: "Gift Details",
    },
  ];

  return (
    <section className="bucket-builder-page">
      <div className="bucket-builder-shell">

        <header className="builder-header">
          <div className="builder-header-title-box">
            <div className="builder-sparkle-icon">
              <Gift size={21} />
            </div>

            <div className="builder-heading-copy">
              <h1 className="builder-main-title">
                Build Your Gift
              </h1>

              <p className="builder-subtitle">
                Create a personalized dry fruit hamper.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="builder-back-btn"
            onClick={onClose}
          >
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </button>
        </header>

        <nav
          className="builder-steps-tracker"
          aria-label="Gift builder steps"
        >
          {steps.map((item, index) => (
            <React.Fragment
              key={item.number}
            >
              <button
                type="button"
                className={`step-tab ${
                  step === item.number
                    ? "active"
                    : step > item.number
                    ? "completed"
                    : ""
                }`}
                onClick={() => {
                  if (
                    item.number >
                    step
                  ) {
                    if (!validateStep()) {
                      return;
                    }
                  }

                  setStep(item.number);
                }}
              >
                <span className="step-circle">
                  {step > item.number ? (
                    <Check size={14} />
                  ) : (
                    item.number
                  )}
                </span>

                <span className="step-label">
                  {item.label}
                </span>
              </button>

              {index <
                steps.length - 1 && (
                <span className="step-divider" />
              )}
            </React.Fragment>
          ))}
        </nav>

        {loading && (
          <div className="studio-loader-container">
            {/* Branded Luxury Status Indicator */}
            <div className="studio-loader-banner">
              <div className="studio-loader-icon-wrapper">
                <div className="studio-loader-spinner" />
                <Sparkles size={18} className="studio-loader-sparkle" />
              </div>
              <div className="studio-loader-text">
                <h3 className="studio-loader-heading">
                  Curating Handcrafted Custom Studio
                </h3>
                <p className="studio-loader-subtext">
                  Preparing artisanal containers, fresh dry fruits & bespoke gift packaging...
                </p>
              </div>
            </div>

            {/* Realistic Studio Skeleton UI matching Step 1 & Preview Pane */}
            <div className="builder-content-grid studio-skeleton-grid" aria-hidden="true">
              <main className="builder-step-pane">
                <div className="step-section">
                  <div className="step-title-row">
                    <div style={{ flex: 1 }}>
                      <div className="studio-skeleton-line studio-skeleton-title" />
                      <div className="studio-skeleton-line studio-skeleton-subtext" />
                    </div>
                    <div className="studio-skeleton-pill" />
                  </div>

                  <div className="containers-grid">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="studio-skeleton-card">
                        <div className="studio-skeleton-img" />
                        <div className="studio-skeleton-card-body">
                          <div className="studio-skeleton-line studio-skeleton-card-title" />
                          <div className="studio-skeleton-line studio-skeleton-card-meta" />
                          <div className="studio-skeleton-bottom-row">
                            <div className="studio-skeleton-price-pill" />
                            <div className="studio-skeleton-btn-pill" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </main>

              <aside className="builder-preview-pane">
                <div className="studio-skeleton-preview-box">
                  <div className="studio-skeleton-preview-header">
                    <div className="studio-skeleton-pill" style={{ width: "90px" }} />
                    <div className="studio-skeleton-circle" />
                  </div>
                  <div className="studio-skeleton-preview-img" />
                  <div className="studio-skeleton-preview-details">
                    <div className="studio-skeleton-line" style={{ width: "65%", height: "18px" }} />
                    <div className="studio-skeleton-line" style={{ width: "85%", height: "12px", marginTop: "8px" }} />
                    <div className="studio-skeleton-divider" />
                    <div className="studio-skeleton-line" style={{ width: "100%", height: "14px" }} />
                    <div className="studio-skeleton-line" style={{ width: "100%", height: "14px", marginTop: "8px" }} />
                    <div className="studio-skeleton-total-bar">
                      <div className="studio-skeleton-line" style={{ width: "40%", height: "16px" }} />
                      <div className="studio-skeleton-line" style={{ width: "30%", height: "20px" }} />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {!loading && loadError && (
          <div className="bucket-builder-error">
            <X size={20} />
            <div>
              <strong>
                Custom Studio unavailable
              </strong>

              <p>
                {loadError}
              </p>
            </div>
          </div>
        )}

        {!loading &&
          !loadError && (
            <div className="builder-content-grid">

              <main className="builder-step-pane">

                {step === 1 && (
                  <section className="step-section">
                    <div className="step-title-row">
                      <div>
                        <h2 className="step-headline">
                          Choose a Container
                        </h2>

                        <p className="step-subtext">
                          Select the packaging for your custom gift.
                        </p>
                      </div>

                      <span className="step-count">
                        {containers.length} options
                      </span>
                    </div>

                    {containers.length === 0 ? (
                      <div className="builder-empty-state">
                        No containers are available right now.
                      </div>
                    ) : (
                      <div className="containers-grid">
                        {containers.map(
                          (container) => {
                            const containerId =
                              getId(
                                container
                              );

                            const selected =
                              getId(
                                selectedContainer
                              ) ===
                              containerId;

                            return (
                              <button
                                type="button"
                                key={
                                  containerId
                                }
                                className={`container-choice-card ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedContainer(
                                    container
                                  )
                                }
                                aria-pressed={
                                  selected
                                }
                              >
                                <div className="container-thumb">
                                  <img
                                    src={getImageUrl(
                                      container.image
                                    )}
                                    alt={
                                      container.name ||
                                      "Gift container"
                                    }
                                    className="container-thumb-image"
                                    loading="lazy"
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.src =
                                        "/images/bucket_hamper.jpg";
                                    }}
                                  />
                                </div>

                                <div className="container-info">
                                  <div className="container-badge-row">
                                    {container.badge && (
                                      <span className="container-badge">
                                        {
                                          container.badge
                                        }
                                      </span>
                                    )}

                                    <span className="container-price">
                                      {formatPrice(
                                        Number(
                                          container.price
                                        ) || 0
                                      )}
                                    </span>
                                  </div>

                                  <h3 className="container-name">
                                    {
                                      container.name
                                    }
                                  </h3>

                                  {container.capacity && (
                                    <span className="container-cap">
                                      {
                                        container.capacity
                                      }
                                    </span>
                                  )}
                                </div>

                                {selected && (
                                  <span className="check-indicator">
                                    <Check size={15} />
                                  </span>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </section>
                )}

                {step === 2 && (
                  <section className="step-section">
                    <div className="step-title-row">
                      <div>
                        <h2 className="step-headline">
                          Choose Dry Fruits
                        </h2>

                        <p className="step-subtext">
                          Select 1 to 6 varieties for your gift.
                        </p>
                      </div>

                      <span className="fillers-count-badge">
                        {selectedFillers.length}/6
                      </span>
                    </div>

                    {fillers.length === 0 ? (
                      <div className="builder-empty-state">
                        No dry fruits are available right now.
                      </div>
                    ) : (
                      <div className="fillers-grid">
                        {fillers.map(
                          (filler) => {
                            const fillerId =
                              getId(filler);

                            const selected =
                              selectedFillers.some(
                                (item) =>
                                  getId(item) ===
                                  fillerId
                              );

                            return (
                              <button
                                type="button"
                                key={
                                  fillerId
                                }
                                className={`filler-choice-card ${
                                  selected
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleToggleFiller(
                                    filler
                                  )
                                }
                                aria-pressed={
                                  selected
                                }
                              >

                                <div className="filler-image-wrap">
                                  <img
                                    src={getImageUrl(
                                      filler.image
                                    )}
                                    alt={
                                      filler.name ||
                                      "Dry fruit"
                                    }
                                    className="filler-image"
                                    loading="lazy"
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.src =
                                        "/images/bucket_hamper.jpg";
                                    }}
                                  />
                                </div>

                                <span className="filler-details">
                                  <span className="filler-name">
                                    {
                                      filler.name
                                    }
                                  </span>

                                  <span className="filler-category">
                                    {
                                      filler.category ||
                                      "Nuts"
                                    }
                                  </span>

                                  <span className="filler-portion">
                                    {formatPrice(
                                      getFillerPrice(
                                        filler
                                      )
                                    )}

                                    {filler.weight && (
                                      <span>
                                        {" "}
                                        /{" "}
                                        {
                                          filler.weight
                                        }
                                        g
                                      </span>
                                    )}
                                  </span>
                                </span>

                                <span
                                  className={`filler-checkbox ${
                                    selected
                                      ? "checked"
                                      : ""
                                  }`}
                                >
                                  {selected ? (
                                    <Check
                                      size={14}
                                    />
                                  ) : (
                                    <Plus
                                      size={14}
                                    />
                                  )}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </section>
                )}

                {step === 3 && (
                  <section className="step-section">
                    <div>
                      <h2 className="step-headline">
                        Gift Details
                      </h2>

                      <p className="step-subtext">
                        Finish your hamper with a ribbon and personal message.
                      </p>
                    </div>

                    <div className="ribbons-selector-block">
                      <span className="sub-label">
                        Choose a ribbon
                      </span>

                      {ribbons.length === 0 ? (
                        <div className="builder-empty-state">
                          No ribbons are available right now.
                        </div>
                      ) : (
                        <div className="ribbons-row">
                          {ribbons.map(
                            (ribbon) => {
                              const ribbonId =
                                getId(
                                  ribbon
                                );

                              const selected =
                                getId(
                                  selectedRibbon
                                ) ===
                                ribbonId;

                              const ribbonExtraCost =
                                Number(
                                  ribbon.price ??
                                    ribbon.cost ??
                                    0
                                ) || 0;

                              return (
                                <button
                                  type="button"
                                  key={
                                    ribbonId
                                  }
                                  className={`ribbon-choice-btn ${
                                    selected
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    setSelectedRibbon(
                                      ribbon
                                    )
                                  }
                                  aria-pressed={
                                    selected
                                  }
                                >
                                  <span
                                    className="ribbon-color-dot"
                                    style={{
                                      backgroundColor:
                                        ribbon.color ||
                                        "#eab308",
                                    }}
                                  />

                                  <span>
                                    {
                                      ribbon.name
                                    }
                                  </span>

                                  {ribbonExtraCost >
                                    0 && (
                                    <span className="ribbon-extra">
                                      +
                                      {formatPrice(
                                        ribbonExtraCost
                                      )}
                                    </span>
                                  )}

                                  {selected && (
                                    <Check
                                      size={
                                        14
                                      }
                                    />
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>

                    <div className="gift-message-block">
                      <div className="form-group">
                        <label htmlFor="bucket-recipient-name">
                          Recipient name
                        </label>

                        <input
                          id="bucket-recipient-name"
                          className="form-input"
                          type="text"
                          placeholder="Enter recipient name (optional)"
                          value={
                            recipientName
                          }
                          onChange={(
                            event
                          ) =>
                            setRecipientName(
                              event.target.value
                            )
                          }
                          maxLength={80}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="bucket-gift-message">
                          Gift message
                        </label>

                        <textarea
                          id="bucket-gift-message"
                          className="form-textarea"
                          rows={3}
                          placeholder="Write a personal message..."
                          value={
                            giftMessage
                          }
                          onChange={(
                            event
                          ) =>
                            setGiftMessage(
                              event.target.value
                            )
                          }
                          maxLength={180}
                        />

                        <span className="char-count">
                          {
                            giftMessage.length
                          }
                          /180
                        </span>
                      </div>
                    </div>
                  </section>
                )}

                <div className="builder-navigation">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={
                      handlePrevious
                    }
                    disabled={step === 1}
                  >
                    <ArrowLeft
                      size={15}
                    />
                    Previous
                  </button>

                  {step < 3 ? (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={
                        handleNext
                      }
                    >
                      Continue
                      <ArrowRight
                        size={15}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={
                        handleOrderOnWhatsApp
                      }
                    >
                      <MessageCircle
                        size={16}
                      />
                      Enquire on WhatsApp
                    </button>
                  )}
                </div>
              </main>

              <aside className="builder-preview-pane">
                <div className="preview-heading">
                  <div>
                    <span className="live-preview-tag">
                      <Sparkles
                        size={15}
                      />
                      YOUR GIFT
                    </span>

                    <p className="preview-caption">
                      Your selection at a glance
                    </p>
                  </div>

                  <CircleCheck
                    size={19}
                  />
                </div>

                <div className="live-bucket-card">
                  <div className="preview-image-wrap">
                    <img
                      src={getImageUrl(
                        selectedContainer?.image
                      )}
                      alt={
                        selectedContainer?.name ||
                        "Gift bucket"
                      }
                      className="preview-bucket-img"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          "/images/bucket_hamper.jpg";
                      }}
                    />

                    {selectedRibbon && (
                      <span
                        className="preview-ribbon-tag"
                        style={{
                          backgroundColor:
                            selectedRibbon.color ||
                            "#eab308",
                        }}
                      >
                        <Ribbon
                          size={16}
                        />
                      </span>
                    )}
                  </div>

                  <h3 className="preview-bucket-title">
                    {selectedContainer?.name ||
                      "Custom Hamper"}
                  </h3>

                  <p className="preview-weight-spec">
                    {totalWeight}g ·{" "}
                    {
                      selectedFillers.length
                    }{" "}
                    varieties
                  </p>

                  <div className="preview-fillers-list">
                    <span className="preview-fillers-label">
                      Selected dry fruits
                    </span>

                    <div className="preview-fillers-tags">
                      {selectedFillers.map(
                        (filler) => (
                          <span
                            key={getId(
                              filler
                            )}
                            className="preview-filler-pill"
                          >
                            {filler.image && (
                              <img
                                src={getImageUrl(
                                  filler.image
                                )}
                                alt=""
                                className="preview-filler-image"
                              />
                            )}

                            {
                              filler.name
                            }
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {giftMessage.trim() && (
                    <div className="preview-greeting-card">
                      <span className="greeting-to">
                        {recipientName.trim()
                          ? `For ${recipientName.trim()}`
                          : "Warm wishes"}
                      </span>

                      <p className="greeting-preview-text">
                        {
                          giftMessage
                        }
                      </p>
                    </div>
                  )}

                  <div className="preview-cost-summary">
                    <div className="cost-row">
                      <span>
                        Container
                      </span>

                      <span>
                        {formatPrice(
                          containerCost
                        )}
                      </span>
                    </div>

                    <div className="cost-row">
                      <span>
                        Dry fruits
                      </span>

                      <span>
                        {formatPrice(
                          fillersCost
                        )}
                      </span>
                    </div>

                    {ribbonCost > 0 && (
                      <div className="cost-row">
                        <span>
                          Ribbon
                        </span>

                        <span>
                          {formatPrice(
                            ribbonCost
                          )}
                        </span>
                      </div>
                    )}

                    <div className="cost-total-row">
                      <span>
                        Estimated total
                      </span>

                      <strong className="total-highlight">
                        {formatPrice(
                          totalPrice
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="builder-add-btn"
                  onClick={
                    handleOrderOnWhatsApp
                  }
                >
                  <MessageCircle
                    size={17}
                  />
                  Enquire on WhatsApp
                </button>

                <p className="preview-disclaimer">
                  Final price and availability will be confirmed by our team.
                </p>
              </aside>
            </div>
          )}
      </div>
    </section>
  );
};

export default BucketBuilder;