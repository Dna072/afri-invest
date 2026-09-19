export interface StageGate {
  id: string;
  label: string;
  mandatory: boolean;
  complete: boolean;
}

export interface StageAssessment {
  canPass: boolean;
  outstanding: StageGate[];
  blocked: StageGate[];
}

export function assessStage(gates: StageGate[]): StageAssessment {
  const outstanding = gates.filter((g) => g.mandatory && !g.complete);
  return {
    canPass: outstanding.length === 0,
    outstanding,
    blocked: [],
  };
}

export function assertCanPass(gates: StageGate[], override = false) {
  const result = assessStage(gates);
  if (!result.canPass && !override) {
    return { allowed: false, reason: "Mandatory gates remain incomplete." };
  }
  return { allowed: true, reason: override ? "Administrative override recorded." : "All mandatory gates complete." };
}
