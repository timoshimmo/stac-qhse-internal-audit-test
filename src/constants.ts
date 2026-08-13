import { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Which definition of an audit (ISO 9000:2015) is correct?',
    options: [
      'A. A surprise inspection to catch people breaking rules',
      'B. A systematic, independent and documented process for obtaining audit evidence and evaluating it objectively against audit criteria',
      'C. A management review of KPI performance',
      'D. A documentation exercise required only before certification',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q2',
    text: 'An audit finding is produced by comparing:',
    options: [
      'A. Two different sites with each other',
      'B. The auditee’s experience with the auditor’s experience',
      'C. Audit evidence with audit criteria',
      'D. Current procedures with last year’s procedures',
    ],
    correctAnswer: 2,
  },
  {
    id: 'q3',
    text: 'Which of the following is not objective evidence?',
    options: [
      'A. A signed permit displayed at the worksite',
      'B. A calibration record in the register',
      'C. A supervisor’s assurance that “everyone knows the procedure”',
      'D. Direct observation of segregated waste storage',
    ],
    correctAnswer: 2,
  },
  {
    id: 'q4',
    text: 'Our audit of a support-vessel contractor’s lifting controls is which type of audit?',
    options: [
      'A. First party',
      'B. Second party',
      'C. Third party',
      'D. Certification audit',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q5',
    text: 'Which is one of the seven principles of auditing (ISO 19011:2018)?',
    options: [
      'A. Prescriptive guidance — tell the auditee exactly how to fix problems',
      'B. Independence — be impartial and never audit your own work',
      'C. Completeness — check every record in the department',
      'D. Escalation — report every issue immediately to top management',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q6',
    text: 'During an interview, which question style should an auditor generally avoid?',
    options: [
      'A. “Walk me through how you receive a delivery.”',
      'B. “You always check the certificate of conformity, right?”',
      'C. “What happens when a part fails receipt inspection?”',
      'D. “Where is the SDS for this chemical kept?”',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q7',
    text: ' You find one gauge overdue for calibration; the register and procedure otherwise work. The proportionate grade is:',
    options: [
      'A. Major NC', 
      'B. Minor NC',
      'C. No finding — one instance is always ignored',
      'D. OFI — because the system exists',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q8',
    text: 'A well-written NCR must contain which three elements?',
    options: [
      'A. WHO is to blame / WHAT happened / WHEN it happened',
      'B. WHAT the evidence shows / WHERE it was found / WHY it breaches a requirement',
      'C. WHAT happened / HOW to fix it / WHO will fix it',
      'D. WHERE it was found / WHAT the auditor recommends / WHEN it must close',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q9',
    text: 'Gauge PG-218 was found overdue for calibration. Which of the following is a corrective action (not a correction)?',
    options: [
      'A. Recalibrate PG-218 and return it to service',
      'B. Add an owned intake checkpoint so every new gauge enters the calibration register',
      'C. Quarantine the gauge until calibration is done',
      'D. Note the lapse in the audit report',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q10',
    text: 'Audit results must feed which other mandatory management-system process?',
    options: [
      'A. Management review (clause 9.3)',
      'B. Management of change',
      'C. The annual budget cycle',
      'D. The recruitment process',
    ],
    correctAnswer: 0,
  },
];

export const PASSING_GRADE = 70;
