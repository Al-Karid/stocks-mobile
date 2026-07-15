import { useState, useEffect, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";

type BiometricAuthState = {
  /** Whether the device has biometric hardware */
  isCompatible: boolean;
  /** Whether biometric data is enrolled on the device */
  isEnrolled: boolean;
  /** Whether the user has successfully authenticated */
  isAuthenticated: boolean;
  /** Whether a check/authentication is in progress */
  isLoading: boolean;
  /** Error message if something went wrong */
  error: string | null;
  /** Available authentication types on the device */
  authTypes: LocalAuthentication.AuthenticationType[];
};

const AUTH_PROMPT_MESSAGE = "Authenticate to access Portfolio";

export function useBiometricAuth() {
  const [state, setState] = useState<BiometricAuthState>({
    isCompatible: false,
    isEnrolled: false,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    authTypes: [],
  });

  const checkBiometrics = useCallback(async () => {
    try {
      const [compatible, enrolled, authTypes] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      setState((prev) => ({
        ...prev,
        isCompatible: compatible,
        isEnrolled: enrolled,
        authTypes,
        isLoading: false,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to check biometric availability",
      }));
    }
  }, []);

  const authenticate = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: AUTH_PROMPT_MESSAGE,
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || "Authentication failed",
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Authentication failed",
      }));
    }
  }, []);

  useEffect(() => {
    checkBiometrics();
  }, [checkBiometrics]);

  return { ...state, authenticate, checkBiometrics };
}
