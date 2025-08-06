import {
  AlertTriangle,
  CalendarCheck,
  Clock,
  X,  
} from "lucide-react";

const getExpirationStatus = (expirationDate) => {
  if (!expirationDate) {
    return {
      status: "Expired",
      badgeClass: "bg-red-100 text-red-600 border border-red-400",
      borderClass: "border-l-red-500",
      icon: <X className="h-4 w-4" />,
      daysText: "No deadline",
    };
  }

  // Parse the DD-MM-YYYY format
  let expDate;
  try {
    const [day, month, year] = expirationDate.split("-").map(Number);
    expDate = new Date(year, month - 1, day);
    if (isNaN(expDate.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    return {
      status: "Expired",
      badgeClass: "bg-red-100 text-red-600 border border-red-400",
      borderClass: "border-l-red-500",
      icon: <X className="h-4 w-4" />,
      daysText: "Invalid date",
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const expiryDate = new Date(
    expDate.getFullYear(),
    expDate.getMonth(),
    expDate.getDate()
  );

  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "Expired",
      badgeClass: "bg-red-100 text-red-600 border border-red-400",
      borderClass: "border-l-red-500",
      icon: <X className="h-4 w-4" />,
      daysText: "Submission closed",
    };
  } else if (diffDays <= 3) {
    return {
      status: "Expiring Soon",
      badgeClass: "bg-yellow-100 text-yellow-600 border border-yellow-400",
      borderClass: "border-l-yellow-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      daysText: diffDays === 0 ? "Last day to submit" : `${diffDays} days left`,
    };
  } else {
    return {
      status: "Active",
      badgeClass: "bg-green-100 text-green-600 border border-green-400",
      borderClass: "border-l-green-500",
      icon: <CalendarCheck className="h-4 w-4" />,
      daysText: `${diffDays} days left`,
    };
  }
};

export default getExpirationStatus;