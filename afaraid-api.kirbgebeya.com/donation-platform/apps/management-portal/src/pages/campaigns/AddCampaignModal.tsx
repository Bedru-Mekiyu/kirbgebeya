import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiImage,
  FiGlobe,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import campaignService from "@/services/campaignsService";
import goatsService from "@/services/goatsService";
import type { Campaign, CampaignDetail } from "@/services/campaignsService";
import toast from "react-hot-toast";
import { ENV_CONFIG } from "@/config";

interface AddCampaignModalProps {
  addCampaignToList: (campaign: Campaign & { detail?: CampaignDetail }) => void;
  onUpdateAdded?: () => void;
}

interface CampaignFormData {
  title: string;
  description: string;
  status: "Active" | "Completed" | "Cancelled";
  isHot: boolean;

  image: string;
  location: string;
  beneficiaries: number;
  raisedAmount: number;
  goalAmount: number;
  currency: string;
  donors: number;
  longDescription: string;
  startDate: string;
  endDate: string;
}

const CURRENCY_OPTIONS = [{ value: "ETB", label: "ETB - Ethiopian Birr" }];

const GOAT_CONFIG = {
  GOATS_PER_FAMILY: 3, // 3 goats can support a family
  GOAT_PRICE: {
    USD: 50,
    ETB: 2500,
    AED: 185,
  },
};

const IMGBB_API_KEY = ENV_CONFIG.IMGBB_API_KE;

export default function AddCampaignModal({
  addCampaignToList,
  onUpdateAdded,
}: AddCampaignModalProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<CampaignFormData>({
    title: "",
    description: "",
    status: "Active",
    isHot: false,

    image: "",
    location: "",
    beneficiaries: 0,
    raisedAmount: 0,
    goalAmount: 0,
    currency: "",
    donors: 0,
    longDescription: "",
    startDate: "",
    endDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goatPrice, setGoatPrice] = useState<number>(0);
  const [useCustomPrice, setUseCustomPrice] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    const fetchGoatPrice = async () => {
      if (formData.currency) {
        try {
          const pricing: GoatPricing = await goatsService.getGoatPricing();
          const price = useCustomPrice ? customPrice : pricing.goatPrice;
          setGoatPrice(price);
        } catch (error) {
          console.warn("Failed to fetch goat price, using default:", error);
          const defaultPrice =
            GOAT_CONFIG.GOAT_PRICE[
            formData.currency as keyof typeof GOAT_CONFIG.GOAT_PRICE
            ] || GOAT_CONFIG.GOAT_PRICE.USD;
          setGoatPrice(defaultPrice);
        }
      }
    };

    fetchGoatPrice();
  }, [formData.currency, useCustomPrice, customPrice]);

  useEffect(() => {
    if (formData.beneficiaries > 0 && formData.currency && goatPrice > 0) {
      const familiesSupported = formData.beneficiaries;
      const goatsNeeded = familiesSupported * GOAT_CONFIG.GOATS_PER_FAMILY;
      const calculatedGoal = goatsNeeded * goatPrice;

      setFormData((prev) => ({
        ...prev,
        goalAmount: Math.round(calculatedGoal),
      }));
    }
  }, [formData.beneficiaries, formData.currency, goatPrice]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Please select an image smaller than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    handleInputChange("image", "");
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  const handleCustomPriceToggle = (enabled: boolean) => {
    setUseCustomPrice(enabled);
    if (!enabled) {
      setCustomPrice(0);
      fetchGoatPriceFromDatabase();
    }
  };

  const fetchGoatPriceFromDatabase = async () => {
    try {
      const pricing: GoatPricing = await goatsService.getGoatPricing();
      setGoatPrice(pricing.goatPrice);
    } catch (error) {
      console.warn("Failed to fetch goat price:", error);
    }
  };

  const handleCustomPriceChange = (value: string) => {
    const price = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
    setCustomPrice(price);
    if (useCustomPrice) {
      setGoatPrice(price);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "Active",
      isHot: false,
      image: "",
      location: "",
      beneficiaries: 0,
      raisedAmount: 0,
      goalAmount: 0,
      currency: "",
      donors: 0,
      longDescription: "",
      startDate: "",
      endDate: "",
    });
    setError(null);
    setGoatPrice(0);
    setUseCustomPrice(false);
    setCustomPrice(0);
    setSelectedFile(null);
    setImagePreview("");
  };

  const handleInputChange = (field: keyof CampaignFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "image" && value && selectedFile) {
      setSelectedFile(null);
      setImagePreview("");
    }
  };

  const handleNumberInputChange = (
    field: keyof CampaignFormData,
    value: string
  ) => {
    const numValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      setError("Campaign title is required");
      return false;
    }

    if (!formData.description.trim()) {
      setError("Campaign description is required");
      return false;
    }

    if (formData.goalAmount <= 0) {
      setError("Goal amount must be greater than 0");
      return false;
    }

    if (!formData.startDate) {
      setError("Start date is required");
      return false;
    }

    if (!formData.endDate) {
      setError("End date is required");
      return false;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError("End date must be after start date");
      return false;
    }

    if (formData.raisedAmount > formData.goalAmount) {
      setError("Raised amount cannot exceed goal amount");
      return false;
    }

    if (!formData.image && !selectedFile) {
      setError("Please either upload an image or provide an image URL");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = formData.image;

      if (selectedFile) {
        try {
          toast.loading("Uploading image to free storage...", { id: "image-upload" });
          finalImageUrl = await uploadImageToStorage(selectedFile);
          toast.success("Image uploaded successfully!", { id: "image-upload" });
        } catch (uploadError) {
          toast.error("Failed to upload image. Please use image URL instead.", {
            id: "image-upload",
            duration: 5000
          });
          setSubmitting(false);
          return;
        }
      }

      const campaignData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        isHot: formData.isHot,
        details: [
          {
            image: finalImageUrl,
            location: formData.location,
            beneficiaries: formData.beneficiaries,
            raisedAmount: formData.raisedAmount,
            goalAmount: formData.goalAmount,
            donors: formData.donors,
            currency: formData.currency,
            longDescription: formData.longDescription,
            startDate: formData.startDate,
            endDate: formData.endDate,
            goatPricing: {
              useCustomPrice: useCustomPrice,
              customGoatPrice: useCustomPrice ? customPrice : 0,
              calculatedGoatPrice: goatPrice,
              goatsPerFamily: GOAT_CONFIG.GOATS_PER_FAMILY,
              totalGoatsNeeded:
                formData.beneficiaries * GOAT_CONFIG.GOATS_PER_FAMILY,
              priceSource: useCustomPrice ? "custom" : "database",
            },
          },
        ],
        updates: [],
      };

      const newCampaign = await campaignService.createCampaign(campaignData);

      addCampaignToList(newCampaign.data);

      resetForm();

      toast.success("Campaign created successfully!", {
        duration: 4000,
        position: "top-right",
      });

      onUpdateAdded?.();

      closeModal();
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create campaign";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const getMinEndDate = () => {
    return formData.startDate
      ? new Date(formData.startDate).toISOString().split("T")[0]
      : "";
  };

  const calculateImpactMetrics = () => {
    if (formData.beneficiaries > 0 && formData.currency && goatPrice > 0) {
      const familiesSupported = formData.beneficiaries;
      const goatsNeeded = familiesSupported * GOAT_CONFIG.GOATS_PER_FAMILY;
      return {
        familiesSupported,
        goatsNeeded,
        costPerFamily: (goatsNeeded * goatPrice) / familiesSupported,
        costPerBeneficiary: (goatsNeeded * goatPrice) / formData.beneficiaries,
      };
    }
    return null;
  };

  const impactMetrics = calculateImpactMetrics();

  return (
    <>
      <Button onClick={openModal} className="flex items-center gap-2">
        <FiTarget size={18} />
        Add New Campaign
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="max-w-[800px] m-4"
      >
        <div className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
            Create New Campaign
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Fill in the campaign details to launch a new fundraising initiative.
          </p>

          {error && (
            <div className="text-red-500 mb-4 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Campaign Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2">
                Basic Information
              </h3>

              <div>
                <Label>Campaign Title *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Emergency Relief for Flood Victims"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <Label>Short Description *</Label>
                <TextArea
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Brief description of the campaign purpose and goals..."
                  rows={3}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <Label>Detailed Description</Label>
                <TextArea
                  value={formData.longDescription}
                  onChange={(value) =>
                    handleInputChange("longDescription", value)
                  }
                  placeholder="Comprehensive details about the campaign, impact, and how funds will be used..."
                  rows={5}
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isHot"
                    checked={formData.isHot}
                    onChange={(e) =>
                      handleInputChange("isHot", e.target.checked)
                    }
                    disabled={submitting}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <Label htmlFor="isHot" className="cursor-pointer">
                    Feature this campaign
                  </Label>
                </div>
              </div>
            </div>

            {/* Location & Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2">
                Location & Media
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <div className="relative">
                    <FiMapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Country"
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <Label>Upload Image</Label>
                    <div className="relative">
                      <FiUpload
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                        disabled={submitting}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max 5MB. Will be uploaded to free storage on submit.
                    </p>
                  </div>

                  {/* URL Input as fallback */}
                  <div>
                    <Label>Or Enter Image URL</Label>
                    <div className="relative">
                      <FiImage
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <Input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange("image", e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="pl-10"
                        disabled={submitting || !!selectedFile}
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="mt-2">
                      <Label>Image Preview</Label>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="h-20 rounded border dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview("");
                            handleInputChange("image", "");
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          disabled={submitting}
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Impact & Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2">
                Impact & Duration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Beneficiaries *</Label>
                  <div className="relative">
                    <FiUsers
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="number"
                      value={formData.beneficiaries || ""}
                      onChange={(e) =>
                        handleNumberInputChange("beneficiaries", e.target.value)
                      }
                      placeholder="100"
                      min="1"
                      className="pl-10"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <Label>Donors</Label>
                  <div className="relative">
                    <FiUsers
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="number"
                      value={formData.donors || ""}
                      onChange={(e) =>
                        handleNumberInputChange("donors", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date *</Label>
                  <div className="relative">
                    <FiCalendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        handleInputChange("startDate", e.target.value)
                      }
                      className="pl-10"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <Label>End Date *</Label>
                  <div className="relative">
                    <FiCalendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        handleInputChange("endDate", e.target.value)
                      }
                      min={getMinEndDate()}
                      className="pl-10"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b border-gray-200 dark:border-gray-700 pb-2">
                Financial Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Currency *</Label>
                  <div className="relative">
                    <FiGlobe
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Select
                      value={formData.currency}
                      onChange={(value: string) =>
                        handleInputChange("currency", value)
                      }
                      options={CURRENCY_OPTIONS}
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label>Goat Price Configuration</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="dbPrice"
                        name="goatPriceSource"
                        checked={!useCustomPrice}
                        onChange={() => handleCustomPriceToggle(false)}
                        disabled={submitting}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="dbPrice" className="cursor-pointer">
                        Use Common Price
                      </Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="customPrice"
                        name="goatPriceSource"
                        checked={useCustomPrice}
                        onChange={() => handleCustomPriceToggle(true)}
                        disabled={submitting}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <Label htmlFor="customPrice" className="cursor-pointer">
                        Use Custom Price
                      </Label>
                    </div>

                    {useCustomPrice && (
                      <div className="pl-6">
                        <Label>Custom Goat Price ({formData.currency})</Label>
                        <div className="relative">
                          <FiDollarSign
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            type="number"
                            value={customPrice || ""}
                            onChange={(e) =>
                              handleCustomPriceChange(e.target.value)
                            }
                            placeholder="Enter custom goat price"
                            min="0"
                            step="0.01"
                            className="pl-10"
                            disabled={submitting}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          This will override the database goat price
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Goal Amount *</Label>
                  <div className="relative">
                    <FiTarget
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="number"
                      value={formData.goalAmount || ""}
                      onChange={(e) =>
                        handleNumberInputChange("goalAmount", e.target.value)
                      }
                      placeholder="Auto-calculated"
                      min="0"
                      step="0.01"
                      className="pl-10 bg-gray-50 dark:bg-gray-800"
                      required
                      disabled={true}
                      title="Goal amount is automatically calculated based on beneficiaries and goat pricing"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-calculated based on beneficiaries
                  </p>
                </div>

                <div>
                  <Label>Raised Amount</Label>
                  <div className="relative">
                    <FiDollarSign
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="number"
                      value={formData.raisedAmount || ""}
                      onChange={(e) =>
                        handleNumberInputChange("raisedAmount", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="pl-10"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Impact Calculation Preview */}
              {impactMetrics && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Impact Calculation
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-green-800 dark:text-green-200 font-medium">
                        Families Supported
                      </div>
                      <div className="text-green-600 dark:text-green-300">
                        {impactMetrics.familiesSupported}
                      </div>
                    </div>
                    <div>
                      <div className="text-green-800 dark:text-green-200 font-medium">
                        Goats Needed
                      </div>
                      <div className="text-green-600 dark:text-green-300">
                        {impactMetrics.goatsNeeded}
                      </div>
                    </div>
                    <div>
                      <div className="text-green-800 dark:text-green-200 font-medium">
                        Goat Price
                      </div>
                      <div className="text-green-600 dark:text-green-300">
                        {formData.currency} {goatPrice.toLocaleString()}
                        <div className="text-xs text-green-500">
                          ({useCustomPrice ? "Custom" : "Database"})
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-green-800 dark:text-green-200 font-medium">
                        Cost per Family
                      </div>
                      <div className="text-green-600 dark:text-green-300">
                        {formData.currency}{" "}
                        {impactMetrics.costPerFamily.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                    Based on {GOAT_CONFIG.GOATS_PER_FAMILY} goats per family and{" "}
                    {goatPrice} {formData.currency} per goat (
                    {useCustomPrice ? "custom price" : "database price"})
                  </div>
                </div>
              )}
            </div>

            {/* Progress Preview */}
            {formData.goalAmount > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Progress Preview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-blue-800 dark:text-blue-200">
                    <span>Progress</span>
                    <span>
                      {(
                        (formData.raisedAmount / formData.goalAmount) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (formData.raisedAmount / formData.goalAmount) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blue-600 dark:text-blue-300">
                    <span>
                      {formData.currency}{" "}
                      {formData.raisedAmount.toLocaleString()}
                    </span>
                    <span>
                      {formData.currency} {formData.goalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                loading={submitting}
                className="min-w-[120px]"
              >
                {submitting ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}