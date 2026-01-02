import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiArrowRight,
  HiCheckCircle,
  HiOutlineArrowsExpand,
  HiOutlineBadgeCheck,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineClipboardCopy,
  HiOutlineDocument,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineExternalLink,
  HiOutlineLink,
  HiOutlineMail,
  HiOutlinePrinter,
  HiOutlineRefresh,
  HiOutlineZoomIn,
  HiOutlineZoomOut,
} from 'react-icons/hi';
import { FaLinkedinIn } from 'react-icons/fa';
import api from '../utils/api';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const getDriveFileId = (url) => {
  if (!url) return '';
  const directMatch = url.match(/\/file\/d\/([^/]+)/);
  if (directMatch?.[1]) return directMatch[1];
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch?.[1]) return idMatch[1];
  return '';
};

const getResumePreviewUrl = (url) => {
  if (!url) return '';
  const driveId = getDriveFileId(url);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/preview`;
  }
  return url;
};

const getResumeDownloadUrl = (url) => {
  if (!url) return '';
  const driveId = getDriveFileId(url);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
  }
  return url;
};

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewerLoading, setViewerLoading] = useState(true);
  const [downloadState, setDownloadState] = useState('idle');
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  const resumeMeta = {
    lastUpdated: 'Dec 2024',
    version: '2024.1',
    fileSize: '2.4 MB',
    pages: '2',
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get('/home');
        setResumeUrl(response.data.data?.cvLink || '');
      } catch (error) {
        toast.error('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  useEffect(() => {
    if (resumeUrl) {
      setViewerLoading(true);
    }
  }, [resumeUrl]);

  useEffect(() => {
    if (downloadState === 'loading') {
      const timer = setTimeout(() => setDownloadState('success'), 1200);
      return () => clearTimeout(timer);
    }

    if (downloadState === 'success') {
      const timer = setTimeout(() => setDownloadState('idle'), 1200);
      return () => clearTimeout(timer);
    }
  }, [downloadState]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleDownload = () => {
    if (!resumeUrl || downloadState === 'loading') return;
    setDownloadState('loading');
    const downloadUrl = getResumeDownloadUrl(resumeUrl);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'resume.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpen = () => {
    if (!resumeUrl) return;
    const previewUrl = getResumePreviewUrl(resumeUrl);
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    if (!resumeUrl) return;
    const previewUrl = getResumePreviewUrl(resumeUrl);
    const printWindow = window.open(previewUrl, '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      toast.error('Popup blocked. Allow popups to print.');
      return;
    }
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 800);
  };

  const handleCopy = async () => {
    if (!resumeUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resumeUrl);
      } else {
        const temp = document.createElement('textarea');
        temp.value = resumeUrl;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      setCopied(true);
      toast.success('Resume link copied.');
    } catch (error) {
      toast.error('Unable to copy resume link.');
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.8));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  if (loading) return <Loading fullScreen />;

  const previewUrl = getResumePreviewUrl(resumeUrl);
  const downloadUrl = getResumeDownloadUrl(resumeUrl);

  const downloadLabel =
    downloadState === 'loading'
      ? 'Downloading...'
      : downloadState === 'success'
        ? 'Saved'
        : 'Download Resume';

  const stats = [
    {
      label: 'Last Updated',
      value: resumeMeta.lastUpdated,
      detail: `Version ${resumeMeta.version}`,
      icon: HiOutlineCalendar,
      from: '#3b82f6',
      to: '#06b6d4',
    },
    {
      label: 'File Size',
      value: resumeMeta.fileSize,
      detail: 'Optimized PDF',
      icon: HiOutlineChartBar,
      from: '#8b5cf6',
      to: '#ec4899',
    },
    {
      label: 'Pages',
      value: resumeMeta.pages,
      detail: 'Full CV',
      icon: HiOutlineDocumentText,
      from: '#10b981',
      to: '#06b6d4',
    },
    {
      label: 'Format',
      value: 'PDF',
      detail: 'Print ready',
      icon: HiOutlineBadgeCheck,
      from: '#f97316',
      to: '#facc15',
    },
  ];

  const quickActions = [
    {
      label: 'Download PDF',
      description: 'High quality export',
      icon: HiOutlineDownload,
      onClick: handleDownload,
    },
    {
      label: 'View in Browser',
      description: 'Open a new tab',
      icon: HiOutlineExternalLink,
      onClick: handleOpen,
    },
    {
      label: 'Print Resume',
      description: 'Printer friendly',
      icon: HiOutlinePrinter,
      onClick: handlePrint,
    },
  ];

  const shareUrl =
    resumeUrl ||
    (typeof window !== 'undefined' ? window.location.href : '');
  const linkedInShareUrl = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`
    : '';
  const emailShareUrl = shareUrl
    ? `mailto:?subject=Resume&body=${encodeURIComponent(
        `Here is my resume: ${shareUrl}`
      )}`
    : '';

  const formats = [
    {
      label: 'PDF',
      description: 'Primary format',
      href: downloadUrl,
      from: '#3b82f6',
      to: '#06b6d4',
    },
    {
      label: 'DOCX',
      description: 'Editable copy',
      href: '',
      from: '#8b5cf6',
      to: '#ec4899',
    },
    {
      label: 'TXT',
      description: 'Plain text',
      href: '',
      from: '#10b981',
      to: '#22c55e',
    },
    {
      label: 'Online',
      description: 'LinkedIn profile',
      href: '',
      from: '#f97316',
      to: '#facc15',
    },
  ];

  return (
    <div className="resume-page min-h-screen pt-16">
      <section className="resume-hero">
        <div className="resume-hero-pattern" aria-hidden="true" />
        <div className="resume-hero-spotlight" aria-hidden="true" />
        <div className="resume-hero-shape resume-hero-shape-one" aria-hidden="true" />
        <div className="resume-hero-shape resume-hero-shape-two" aria-hidden="true" />
        <div className="resume-hero-shape resume-hero-shape-three" aria-hidden="true" />
        <div className="resume-hero-icon resume-hero-icon-one" aria-hidden="true">
          <HiOutlineDocumentText />
        </div>
        <div className="resume-hero-icon resume-hero-icon-two" aria-hidden="true">
          <HiOutlineDocument />
        </div>
        <div className="resume-hero-icon resume-hero-icon-three" aria-hidden="true">
          <HiOutlineDocumentText />
        </div>
        <div className="resume-hero-particle resume-hero-particle-one" aria-hidden="true" />
        <div className="resume-hero-particle resume-hero-particle-two" aria-hidden="true" />
        <div className="resume-hero-particle resume-hero-particle-three" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="resume-hero-title">Resume</h1>
          <p className="resume-hero-subtitle">
            <span className="resume-hero-subtitle-icon">
              <HiOutlineDocumentText />
            </span>
            View and <span className="resume-highlight">download</span> my
            latest CV with a premium document experience.
          </p>
          <div className="resume-hero-meta">
            <span className="resume-hero-pill">
              Updated {resumeMeta.lastUpdated}
            </span>
            <span className="resume-hero-pill">
              Version {resumeMeta.version}
            </span>
          </div>
        </div>
        <svg
          className="resume-hero-wave"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#0b1120"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32L1440,140L1360,140C1280,140,1120,140,960,140C800,140,640,140,480,140C320,140,160,140,80,140L0,140Z"
          />
        </svg>
      </section>

      <div className="resume-content max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {resumeUrl ? (
          <>
            <div className="resume-stats-grid">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="resume-stat-card"
                  style={{ '--from': stat.from, '--to': stat.to }}
                >
                  <div className="resume-stat-card-inner">
                    <div className="resume-stat-icon">
                      <stat.icon />
                    </div>
                    <div>
                      <p className="resume-stat-label">{stat.label}</p>
                      <p className="resume-stat-value">{stat.value}</p>
                      <p className="resume-stat-detail">{stat.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-card">
              <div className="resume-card-inner">
                <span className="resume-card-glow resume-card-glow--tl" />
                <span className="resume-card-glow resume-card-glow--br" />
                <div className="resume-card-top">
                  <div className="resume-intro">
                    <div className="resume-intro-icon">
                      <HiCheckCircle />
                    </div>
                    <div>
                      <p className="resume-intro-title">
                        Latest resume is ready to view or download.
                      </p>
                      <p className="resume-intro-subtitle">
                        PDF format <span>|</span> {resumeMeta.pages} pages{' '}
                        <span>|</span> {resumeMeta.fileSize}
                      </p>
                    </div>
                  </div>
                  <div className="resume-download-wrap">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={!resumeUrl || downloadState === 'loading'}
                      className={`resume-download-btn ${
                        downloadState === 'loading' ? 'is-loading' : ''
                      } ${downloadState === 'success' ? 'is-success' : ''}`}
                    >
                      <span className="resume-download-icon" aria-hidden="true">
                        {downloadState === 'loading' ? (
                          <span className="resume-spinner" />
                        ) : downloadState === 'success' ? (
                          <HiCheckCircle />
                        ) : (
                          <HiOutlineDownload />
                        )}
                      </span>
                      <span aria-live="polite">{downloadLabel}</span>
                    </button>
                    <span className="resume-download-hint">
                      PDF {resumeMeta.fileSize}
                    </span>
                  </div>
                </div>

                <div className="resume-toolbar">
                  <div className="resume-toolbar-group">
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Download PDF"
                      onClick={handleDownload}
                      disabled={!resumeUrl}
                    >
                      <HiOutlineDownload />
                    </button>
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Open fullscreen"
                      onClick={handleOpen}
                      disabled={!resumeUrl}
                    >
                      <HiOutlineArrowsExpand />
                    </button>
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Print resume"
                      onClick={handlePrint}
                      disabled={!resumeUrl}
                    >
                      <HiOutlinePrinter />
                    </button>
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip={copied ? 'Copied' : 'Copy link'}
                      onClick={handleCopy}
                      disabled={!resumeUrl}
                    >
                      {copied ? <HiCheckCircle /> : <HiOutlineClipboardCopy />}
                    </button>
                  </div>
                  <div className="resume-toolbar-group">
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Zoom out"
                      onClick={handleZoomOut}
                      disabled={!resumeUrl}
                    >
                      <HiOutlineZoomOut />
                    </button>
                    <span className="resume-zoom-label">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Zoom in"
                      onClick={handleZoomIn}
                      disabled={!resumeUrl}
                    >
                      <HiOutlineZoomIn />
                    </button>
                    <button
                      type="button"
                      className="resume-toolbar-button"
                      data-tooltip="Reset view"
                      onClick={handleZoomReset}
                      disabled={!resumeUrl}
                    >
                      <HiOutlineRefresh />
                    </button>
                  </div>
                </div>

                <div className="resume-viewer">
                  <div className="resume-viewer-frame">
                    <div className="resume-viewer-scroll">
                      <div
                        className="resume-viewer-canvas"
                        style={{
                          width: `${zoom * 100}%`,
                          height: `${zoom * 100}%`,
                        }}
                      >
                        {previewUrl && (
                          <iframe
                            src={previewUrl}
                            title="Resume"
                            className="resume-viewer-iframe"
                            onLoad={() => setViewerLoading(false)}
                          />
                        )}
                      </div>
                    </div>
                    {viewerLoading && (
                      <div className="resume-viewer-loading" aria-live="polite">
                        <div className="resume-viewer-loading-inner" />
                        <p className="resume-viewer-loading-text">
                          Loading resume preview...
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="resume-viewer-footer">
                    If the preview does not load, use the download button
                    above.
                  </p>
                </div>
              </div>
            </div>

            <div className="resume-split-grid">
              <section className="resume-section">
                <div className="resume-section-header">
                  <h2 className="resume-section-title">Quick Actions</h2>
                  <p className="resume-section-subtitle">
                    Manage your resume instantly with one click actions.
                  </p>
                </div>
                <div className="resume-action-grid">
                  {quickActions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        disabled={!resumeUrl}
                        data-disabled={!resumeUrl}
                        className="resume-action-card"
                      >
                        <div className="resume-action-card-inner">
                          <span className="resume-action-icon">
                            <ActionIcon />
                          </span>
                          <div>
                            <p className="resume-action-title">
                              {action.label}
                            </p>
                            <p className="resume-action-text">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="resume-section">
                <div className="resume-section-header">
                  <h2 className="resume-section-title">Share My Resume</h2>
                  <p className="resume-section-subtitle">
                    Send the resume to collaborators or recruiters.
                  </p>
                </div>
                <div className="resume-share-grid">
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-share-button resume-share-button--linkedin"
                    aria-disabled={!resumeUrl}
                  >
                    <FaLinkedinIn />
                    Share on LinkedIn
                  </a>
                  <a
                    href={emailShareUrl}
                    className="resume-share-button resume-share-button--email"
                    aria-disabled={!resumeUrl}
                  >
                    <HiOutlineMail />
                    Email Resume
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="resume-share-button resume-share-button--copy"
                    disabled={!resumeUrl}
                  >
                    {copied ? <HiCheckCircle /> : <HiOutlineLink />}
                    {copied ? 'Link Copied' : 'Copy Link'}
                  </button>
                </div>
              </section>
            </div>

            <section className="resume-section">
              <div className="resume-section-header">
                <h2 className="resume-section-title">Alternative Formats</h2>
                <p className="resume-section-subtitle">
                  Additional formats are prepared for different workflows.
                </p>
              </div>
              <div className="resume-format-grid">
                {formats.map((format) => (
                  <a
                    key={format.label}
                    href={format.href || '#'}
                    target={format.href ? '_blank' : undefined}
                    rel={format.href ? 'noopener noreferrer' : undefined}
                    className="resume-format-card"
                    data-disabled={!format.href}
                    style={{ '--from': format.from, '--to': format.to }}
                    onClick={(event) => {
                      if (!format.href) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <div className="resume-format-card-inner">
                      <span className="resume-format-icon">
                        <HiOutlineDocumentText />
                      </span>
                      <div>
                        <p className="resume-format-title">{format.label}</p>
                        <p className="resume-format-text">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="resume-cta">
              <div className="resume-cta-card">
                <div>
                  <h2>Interested in working together?</h2>
                  <p>
                    Let&#39;s discuss your next project or opportunity. I
                    respond quickly and love collaborating on ambitious ideas.
                  </p>
                </div>
                <Link to="/contact" className="resume-cta-button">
                  Get In Touch
                  <HiArrowRight />
                </Link>
              </div>
            </section>
          </>
        ) : (
          <div className="resume-empty">
            <div className="resume-empty-icon">
              <HiOutlineDocumentText />
            </div>
            <h2>Resume not available yet</h2>
            <p>Please check back soon or reach out for a copy.</p>
            <Link to="/contact" className="resume-empty-link">
              Contact Me
              <HiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
