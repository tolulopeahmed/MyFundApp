import axios from "axios";
import * as Haptics from "expo-haptics";
import { ipAddress } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setModalHeaderText = (useMode) => {
  if (useMode === "create") {
    return "Create Pin";
  }

  if (useMode === "validate") {
    return "Confirm Pin";
  }

  if (useMode === "change") {
    return "Change Pin";
  }
};

export const setModalBodyText = (
  useMode,
  previusPinConfirmed,
  isConfirmMode
) => {
  if (useMode === "create") {
    return !isConfirmMode
      ? "Set up your secure transaction PIN to ensure smooth and safe financial transactions."
      : "Confirm your pin";
  }

  if (useMode === "validate") {
    return "Secure your purchase with your transaction PIN. Input your pin to proceed.";
  }

  if (useMode === "change") {
    return previusPinConfirmed && isConfirmMode
      ? "Confirm your pin"
      : previusPinConfirmed
      ? "Securely update your transaction PIN for added peace of mind. Your financial safety is our priority."
      : "Input your previous transaction PIN";
  }
};

export const triggerSuccessHapticFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const triggerErrorHapticFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

export const validateUserTransactionPin = async (pin, token) => {
  const { data } = await axios.post(
    `${ipAddress}/api/validate-myfundpin/`,
    {
      entered_pin: pin,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data?.success;
};

export const updateUserTransactionPin = async (pin, token) => {
  const { data } = await axios.post(
    `${ipAddress}/api/update-myfundpin/`,
    {
      myfund_pin: pin,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data?.success;
};

export const userHasTransactionPin = async (token) => {
  const { data } = await axios.get(`${ipAddress}/api/has-myfundpin/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.has_pin;
};

export const quickLogout = async () => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("has-pin");
};

export const checkUserHasPin = async (token) => {
  try {
    const hasPinSaved = await AsyncStorage.getItem("has-pin");
    if (hasPinSaved !== null) return true;

    const hasPin = await userHasTransactionPin(token);
    return hasPin;
  } catch (e) {
    console.error(e);
    Alert.alert("Please check your internet connection and restart the app");
  }
};
