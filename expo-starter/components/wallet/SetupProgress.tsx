import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SetupProgressProps {
  currentStep: number;
}

export function SetupProgress({ currentStep }: SetupProgressProps) {
  const steps = [
    { id: 1, name: "Connect Wallet", icon: "👛" },
    { id: 2, name: "Generate Key", icon: "🔑" },
    { id: 3, name: "Register", icon: "👤" },
    { id: 4, name: "Ready", icon: "✅" }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.stepContent}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                  ]}
                >
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.stepName,
                    (isCompleted || isCurrent) && styles.stepNameActive,
                  ]}
                >
                  {step.name}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    isCompleted && styles.stepConnectorCompleted,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepContent: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCompleted: {
    backgroundColor: '#22C55E',
  },
  stepCurrent: {
    backgroundColor: '#007BFF',
  },
  stepIcon: {
    fontSize: 16,
  },
  stepName: {
    fontSize: 10,
    marginTop: 8,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepNameActive: {
    color: '#161617',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  stepConnectorCompleted: {
    backgroundColor: '#22C55E',
  },
});