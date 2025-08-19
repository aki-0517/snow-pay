import { FaWallet, FaKey, FaUserPlus, FaCheckCircle } from "react-icons/fa";

interface SetupProgressProps {
  currentStep: number;
}

export function SetupProgress({ currentStep }: SetupProgressProps) {
  const steps = [
    { id: 1, name: "Connect Wallet", icon: FaWallet },
    { id: 2, name: "Generate Key", icon: FaKey },
    { id: 3, name: "Register", icon: FaUserPlus },
    { id: 4, name: "Ready", icon: FaCheckCircle }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-snow-success text-white"
                      : isCurrent
                      ? "bg-snow-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs mt-2 ${
                    isCompleted || isCurrent ? "text-snow-dark" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? "bg-snow-success" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}