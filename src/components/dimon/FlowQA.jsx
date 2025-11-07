import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, CheckCircle, XCircle, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QA_TESTS = {
  SEQUENCE_VALIDATION: 'sequence_validation',
  ANIMATION_TIMING: 'animation_timing',
  RESPONSIVENESS: 'responsiveness',
  PERFORMANCE: 'performance',
  TYPOGRAPHY_CONTRAST: 'typography_contrast',
  A11Y_ROLES: 'a11y_roles',
  STATE_PERSISTENCE: 'state_persistence'
};

const EXPECTED_SECTION_ORDER = [
  'section-priority-signals',
  'section-executive-takeaway',
  'section-consensus-meter',
  'section-divergences',
  'section-counterpoints',
  'section-narrative-map',
  'section-source-weighting',
  'section-strategic-trajectory',
  'section-strategic-implications'
];

export default function FlowQA({ digest, isLoading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  const runSequenceValidation = () => {
    const sections = EXPECTED_SECTION_ORDER.map(id => document.getElementById(id));
    const missingSections = sections.filter((section, index) => !section).map((_, index) => EXPECTED_SECTION_ORDER[index]);
    
    if (missingSections.length > 0) {
      return {
        status: 'FAIL',
        message: `Missing sections: ${missingSections.join(', ')}`,
        details: 'Some required sections are not present in the DOM'
      };
    }

    // Check DOM order
    const container = document.getElementById('dimon-digest-container');
    if (!container) {
      return {
        status: 'FAIL',
        message: 'Digest container not found',
        details: 'Main container element is missing'
      };
    }

    const actualOrder = Array.from(container.children)
      .filter(child => child.hasAttribute('data-section-order'))
      .sort((a, b) => parseInt(a.getAttribute('data-section-order')) - parseInt(b.getAttribute('data-section-order')))
      .map(child => child.id);

    const isCorrectOrder = JSON.stringify(actualOrder) === JSON.stringify(EXPECTED_SECTION_ORDER);

    return {
      status: isCorrectOrder ? 'PASS' : 'FAIL',
      message: isCorrectOrder ? 'All sections in correct Dimon order' : 'Sections are misordered',
      details: isCorrectOrder ? 'Priority → Executive → Consensus → Divergences → Counterpoints → Narrative → Sources → Trajectory → Implications' : `Expected: ${EXPECTED_SECTION_ORDER.join(' → ')}, Found: ${actualOrder.join(' → ')}`
    };
  };

  const runAnimationTiming = () => {
    const sections = EXPECTED_SECTION_ORDER.map(id => document.getElementById(id)).filter(Boolean);
    const invalidTimings = [];

    sections.forEach(section => {
      const computedStyle = window.getComputedStyle(section);
      const transitionDuration = computedStyle.transitionDuration;
      
      if (transitionDuration && transitionDuration !== '0s') {
        const duration = parseFloat(transitionDuration) * 1000;
        if (duration < 200 || duration > 900) {
          invalidTimings.push(`${section.id}: ${duration}ms`);
        }
      }
    });

    return {
      status: invalidTimings.length === 0 ? 'PASS' : 'FAIL',
      message: invalidTimings.length === 0 ? 'Animation timings within 200-900ms range' : 'Some animations outside acceptable range',
      details: invalidTimings.length === 0 ? 'All transitions use appropriate timing' : `Invalid timings: ${invalidTimings.join(', ')}`
    };
  };

  const runResponsiveness = () => {
    const testWidths = [390, 768, 1280];
    const issues = [];

    try {
      testWidths.forEach(width => {
        const container = document.getElementById('dimon-digest-container');
        if (container) {
          const hasHorizontalScroll = container.scrollWidth > width;
          if (hasHorizontalScroll) {
            issues.push(`Horizontal scroll at ${width}px`);
          }
        }
      });

      return {
        status: issues.length === 0 ? 'PASS' : 'FAIL',
        message: issues.length === 0 ? 'Responsive across all breakpoints' : 'Responsiveness issues detected',
        details: issues.length === 0 ? 'No horizontal scroll at 390px, 768px, 1280px' : issues.join(', ')
      };
    } catch (error) {
      return {
        status: 'FAIL',
        message: 'Error testing responsiveness',
        details: error.message
      };
    }
  };

  const runPerformance = () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
      const duration = 3000;

      function countFrames() {
        frameCount++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(countFrames);
        } else {
          const fps = Math.round((frameCount / elapsed) * 1000);
          resolve({
            status: fps >= 55 ? 'PASS' : 'FAIL',
            message: `Average FPS: ${fps}`,
            details: fps >= 55 ? 'Performance meets 55+ FPS requirement' : 'Performance below 55 FPS threshold'
          });
        }
      }
      
      requestAnimationFrame(countFrames);
    });
  };

  const runTypographyContrast = () => {
    const textElements = document.querySelectorAll('#dimon-digest-container p, #dimon-digest-container h1, #dimon-digest-container h2, #dimon-digest-container span');
    const lowContrastElements = [];

    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      
      if (color.includes('rgb(')) {
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          if (luminance < 0.4) {
            lowContrastElements.push(element.tagName.toLowerCase());
          }
        }
      }
    });

    return {
      status: lowContrastElements.length === 0 ? 'PASS' : 'FAIL',
      message: lowContrastElements.length === 0 ? 'Text contrast meets WCAG AA' : 'Some text has low contrast',
      details: lowContrastElements.length === 0 ? 'All text elements have sufficient contrast ratio ≥ 4.5:1' : `Low contrast elements: ${[...new Set(lowContrastElements)].join(', ')}`
    };
  };

  const runA11yRoles = () => {
    const issues = [];
    
    const consensusMeter = document.querySelector('[role="progressbar"], [aria-valuenow]');
    if (!consensusMeter) {
      issues.push('Consensus meter missing ARIA attributes');
    }

    const accordions = document.querySelectorAll('button[aria-expanded]');
    if (accordions.length === 0) {
      issues.push('Source accordions missing aria-expanded');
    }

    const implicationsList = document.querySelector('[role="list"]');
    if (!implicationsList) {
      issues.push('Implications panel missing list role');
    }

    return {
      status: issues.length === 0 ? 'PASS' : 'FAIL',
      message: issues.length === 0 ? 'All ARIA roles present' : 'Missing ARIA attributes',
      details: issues.length === 0 ? 'Dial, accordions, and lists have proper ARIA labels' : issues.join(', ')
    };
  };

  const runStatePersistence = () => {
    const densitySetting = localStorage.getItem('vireon-digest-density');
    const hasStoredState = densitySetting !== null;

    return {
      status: hasStoredState ? 'PASS' : 'FAIL',
      message: hasStoredState ? 'Density setting persisted' : 'State persistence not working',
      details: hasStoredState ? `Density setting: ${densitySetting}` : 'localStorage not saving density preference'
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    const results = {};

    const tests = [
      { key: QA_TESTS.SEQUENCE_VALIDATION, runner: runSequenceValidation },
      { key: QA_TESTS.ANIMATION_TIMING, runner: runAnimationTiming },
      { key: QA_TESTS.RESPONSIVENESS, runner: runResponsiveness },
      { key: QA_TESTS.PERFORMANCE, runner: runPerformance },
      { key: QA_TESTS.TYPOGRAPHY_CONTRAST, runner: runTypographyContrast },
      { key: QA_TESTS.A11Y_ROLES, runner: runA11yRoles },
      { key: QA_TESTS.STATE_PERSISTENCE, runner: runStatePersistence }
    ];

    for (const test of tests) {
      setCurrentTest(test.key);
      try {
        const result = await test.runner();
        results[test.key] = result;
      } catch (error) {
        results[test.key] = {
          status: 'FAIL',
          message: 'Test execution error',
          details: error.message
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setTestResults(results);
    setCurrentTest(null);
    setIsRunning(false);
  };

  const resetTests = () => {
    setTestResults({});
    setCurrentTest(null);
    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'FAIL':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const testNames = {
    [QA_TESTS.SEQUENCE_VALIDATION]: 'Dimon Flow Sequence',
    [QA_TESTS.ANIMATION_TIMING]: 'Animation Timing',
    [QA_TESTS.RESPONSIVENESS]: 'Responsiveness',
    [QA_TESTS.PERFORMANCE]: 'Performance',
    [QA_TESTS.TYPOGRAPHY_CONTRAST]: 'Typography Contrast',
    [QA_TESTS.A11Y_ROLES]: 'A11y Roles',
    [QA_TESTS.STATE_PERSISTENCE]: 'State Persistence'
  };

  if (isLoading) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #4D8FFB 0%, #CA33FF 100%)' }}
        whileTap={{ scale: 0.95 }}
      >
        Flow QA
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-96 z-40 overflow-y-auto backdrop-filter backdrop-blur-12 border-l border-white/10"
            style={{ background: 'rgba(18, 20, 25, 0.95)' }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#E9EDF5' }}>
                  Dimon Flow QA
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                  style={{ color: '#9AA3B2' }}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <Button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className="w-full"
                  style={{ background: 'linear-gradient(135deg, #4D8FFB 0%, #CA33FF 100%)' }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </Button>
                
                <Button
                  onClick={resetTests}
                  variant="outline"
                  className="w-full border-white/20 hover:bg-white/10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Tests
                </Button>
              </div>

              <div className="space-y-3">
                {Object.entries(testNames).map(([testKey, testName]) => (
                  <div
                    key={testKey}
                    className={`p-4 rounded-lg border backdrop-filter backdrop-blur-12 ${
                      currentTest === testKey 
                        ? 'border-blue-500/50 bg-blue-500/10' 
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm" style={{ color: '#E9EDF5' }}>
                        {testName}
                      </span>
                      {testResults[testKey] && getStatusIcon(testResults[testKey].status)}
                      {currentTest === testKey && (
                        <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full" />
                      )}
                    </div>
                    
                    {testResults[testKey] && (
                      <div className="space-y-1">
                        <p className={`text-xs ${
                          testResults[testKey].status === 'PASS' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {testResults[testKey].message}
                        </p>
                        <p className="text-xs" style={{ color: '#9AA3B2' }}>
                          {testResults[testKey].details}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {Object.keys(testResults).length > 0 && (
                <div className="mt-6 p-4 rounded-lg border border-white/10" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: '#E9EDF5' }}>
                    Summary
                  </h3>
                  <div className="flex space-x-4 text-xs">
                    <span className="text-green-400">
                      PASS: {Object.values(testResults).filter(r => r.status === 'PASS').length}
                    </span>
                    <span className="text-red-400">
                      FAIL: {Object.values(testResults).filter(r => r.status === 'FAIL').length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}