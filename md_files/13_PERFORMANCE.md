# ⚡ PERFORMANCE NOTES
<!-- Speed optimizations, benchmarks, bottlenecks -->

## Current Metrics
| Metric | Current | Target |
|---|---|---|
| Page Load Time | [X.X]s | < 2s |
| Time to First Byte (TTFB) | [X]ms | < 200ms |
| Largest Contentful Paint (LCP) | [X.X]s | < 2.5s |
| First Input Delay (FID) | [X]ms | < 100ms |
| Cumulative Layout Shift (CLS) | [X.XX] | < 0.1 |
| API Response Time (avg) | [X]ms | < 300ms |
| Database Query Time (avg) | [X]ms | < 50ms |

## Optimization Checklist

### Backend
- [ ] Database queries optimized (no N+1)
- [ ] Indexes on frequently queried columns
- [ ] Query results cached (Redis)
- [ ] Eager loading for relationships
- [ ] API response pagination
- [ ] Background jobs for heavy tasks

### Frontend
- [ ] Images compressed (WebP format)
- [ ] CSS/JS minified and bundled
- [ ] Lazy loading for images/components
- [ ] Browser caching headers set
- [ ] CDN for static assets
- [ ] Code splitting implemented

### Server
- [ ] PHP OPcache enabled
- [ ] Nginx configured with gzip
- [ ] Keep-alive connections
- [ ] HTTP/2 enabled
- [ ] Redis for session/cache

## Bottlenecks Identified

### Issue: [Slow page/query]
- **Measured:** [X.X seconds]
- **Cause:** [N+1 queries / large payload / etc.]
- **Fix:** [What was done]
- **Result:** [Improved to X.X seconds]
- **Date:** YYYY-MM-DD

## Tools Used
| Tool | Purpose |
|---|---|
| Lighthouse | Core Web Vitals |
| Laravel Debugbar | Query analysis |
| Redis Monitor | Cache hits/misses |
| MySQL EXPLAIN | Query optimization |
| GTmetrix | Page speed |
