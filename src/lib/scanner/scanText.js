import { DEMO_DETECTION_RULES } from './demoRules';

export function scanText(sourceCode, fileName = 'snippet.txt') {
  if (!sourceCode) return [];
  const lines = sourceCode.split(/\r?\n/);
  const findings = [];

  DEMO_DETECTION_RULES.forEach(rule => {
    lines.forEach((lineText, index) => {
      const match = lineText.match(rule.pattern);
      if (match) {
        findings.push({
          id: 'FIND-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          ruleId: rule.id,
          ruleName: rule.name,
          family: rule.family,
          quantumStatus: rule.quantum,
          severity: rule.severity,
          confidence: rule.confidence,
          category: rule.category,
          line: index + 1,
          matchedText: match[0],
          snippet: lineText.trim(),
          fileName: fileName
        });
      }
    });
  });

  return findings;
}
