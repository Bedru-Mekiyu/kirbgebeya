import { useState, useEffect } from "react";
import {
    FiCalendar,
    FiMapPin,
    FiDollarSign,
    FiUsers,
    FiTarget,
    FiImage,
    FiGlobe,
    FiStar
} from "react-icons/fi";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import campaignService from "@/services/campaignsService";
import type { Campaign, CampaignDetail, CampaignUpdate } from "@/services/campaignsService";
import toast from "react-hot-toast";

interface EditCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign & { detail?: CampaignDetail; updates?: CampaignUpdate[] };
    updateCampaignInList: (campaign: Campaign & { detail?: CampaignDetail; updates?: CampaignUpdate[] }) => void;
}

interface CampaignFormData {
    // Campaign fields
    title: string;
    description: string;
    status: "Active" | "Completed" | "Cancelled";
    isHot: boolean;

    // CampaignDetail fields
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

const CURRENCY_OPTIONS = [
    // 🌍 Global Currencies
    { value: "USD", label: "USD - US Dollar" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "GBP", label: "GBP - British Pound" },
    { value: "CAD", label: "CAD - Canadian Dollar" },
    { value: "AUD", label: "AUD - Australian Dollar" },
    { value: "ETB", label: "ETB - Ethiopian Birr" },
    { value: "KES", label: "KES - Kenyan Shilling" },

    // 🇸🇦 Arab Region Currencies
    { value: "AED", label: "AED - UAE Dirham" },
    { value: "SAR", label: "SAR - Saudi Riyal" },
    { value: "QAR", label: "QAR - Qatari Riyal" },
    { value: "KWD", label: "KWD - Kuwaiti Dinar" },
    { value: "BHD", label: "BHD - Bahraini Dinar" },
    { value: "OMR", label: "OMR - Omani Rial" },
    { value: "EGP", label: "EGP - Egyptian Pound" },
    { value: "LYD", label: "LYD - Libyan Dinar" },
    { value: "DZD", label: "DZD - Algerian Dinar" },
    { value: "TND", label: "TND - Tunisian Dinar" },
    { value: "MAD", label: "MAD - Moroccan Dirham" },
    { value: "SDG", label: "SDG - Sudanese Pound" },
    { value: "YER", label: "YER - Yemeni Rial" },
    { value: "IQD", label: "IQD - Iraqi Dinar" },
    { value: "SYP", label: "SYP - Syrian Pound" },
    { value: "JOD", label: "JOD - Jordanian Dinar" },
    { value: "LBP", label: "LBP - Lebanese Pound" },
    { value: "SOS", label: "SOS - Somali Shilling" }
];

const STATUS_OPTIONS = [
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
];

export default function EditCampaignModal({ isOpen, onClose, campaign, updateCampaignInList }: EditCampaignModalProps) {
    const [formData, setFormData] = useState<CampaignFormData>({
        // Campaign fields
        title: "",
        description: "",
        status: "Active",
        isHot: false,

        // CampaignDetail fields
        image: "",
        location: "",
        beneficiaries: 0,
        raisedAmount: 0,
        goalAmount: 0,
        currency: "USD",
        donors: 0,
        longDescription: "",
        startDate: "",
        endDate: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form with campaign data
    useEffect(() => {
        if (campaign) {
            setFormData({
                title: campaign.title || "",
                description: campaign.description || "",
                status: campaign.status || "Active",
                isHot: campaign.isHot || false,
                image: campaign.detail?.image || "",
                location: campaign.detail?.location || "",
                beneficiaries: campaign.detail?.beneficiaries || 0,
                raisedAmount: campaign.detail?.raisedAmount || 0,
                goalAmount: campaign.detail?.goalAmount || 0,
                currency: campaign.detail?.currency || "USD",
                donors: campaign.detail?.donors || 0,
                longDescription: campaign.detail?.longDescription || "",
                startDate: campaign.detail?.startDate ? new Date(campaign.detail.startDate).toISOString().split('T')[0] : "",
                endDate: campaign.detail?.endDate ? new Date(campaign.detail.endDate).toISOString().split('T')[0] : ""
            });
        }
    }, [campaign]);

    const resetForm = () => {
        setFormData({
            title: campaign.title || "",
            description: campaign.description || "",
            status: campaign.status || "Active",
            isHot: campaign.isHot || false,
            image: campaign.detail?.image || "",
            location: campaign.detail?.location || "",
            beneficiaries: campaign.detail?.beneficiaries || 0,
            raisedAmount: campaign.detail?.raisedAmount || 0,
            goalAmount: campaign.detail?.goalAmount || 0,
            currency: campaign.detail?.currency || "USD",
            donors: campaign.detail?.donors || 0,
            longDescription: campaign.detail?.longDescription || "",
            startDate: campaign.detail?.startDate ? new Date(campaign.detail.startDate).toISOString().split('T')[0] : "",
            endDate: campaign.detail?.endDate ? new Date(campaign.detail.endDate).toISOString().split('T')[0] : ""
        });
        setError(null);
    };

    const handleInputChange = (field: keyof CampaignFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNumberInputChange = (field: keyof CampaignFormData, value: string) => {
        const numValue = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
        setFormData(prev => ({
            ...prev,
            [field]: numValue
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
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
            const campaignData = {
                // Campaign data
                title: formData.title,
                description: formData.description,
                status: formData.status,
                isHot: formData.isHot,

                // CampaignDetail data
                detail: {
                    image: formData.image,
                    location: formData.location,
                    beneficiaries: formData.beneficiaries,
                    raisedAmount: formData.raisedAmount,
                    goalAmount: formData.goalAmount,
                    currency: formData.currency,
                    donors: formData.donors,
                    longDescription: formData.longDescription,
                    startDate: formData.startDate,
                    endDate: formData.endDate
                }
            };

            const updatedCampaign = await campaignService.updateCampaign(campaign.id, campaignData);
            updateCampaignInList(updatedCampaign);
            closeModal();

            toast.success("Campaign updated successfully!", {
                duration: 4000,
                position: "top-right",
                icon: "✅",
            });
        } catch (err: any) {
            const errorMessage = err.message || "Failed to update campaign";
            setError(errorMessage);
            toast.error(errorMessage, {
                duration: 5000,
                position: "top-right",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    const getMinEndDate = () => {
        return formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : "";
    };

    const progress = formData.goalAmount > 0
        ? (formData.raisedAmount / formData.goalAmount) * 100
        : 0;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[800px] m-4">
            <div className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
                    Edit Campaign
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Update the campaign details and information.
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
                                onChange={(e) => handleInputChange("description", e.target.value)}
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
                                onChange={(e) => handleInputChange("longDescription", e.target.value)}
                                placeholder="Comprehensive details about the campaign, impact, and how funds will be used..."
                                rows={5}
                                disabled={submitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange("status", e.target.value)}
                                    options={STATUS_OPTIONS}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-6">
                                <input
                                    type="checkbox"
                                    id="isHot"
                                    checked={formData.isHot}
                                    onChange={(e) => handleInputChange("isHot", e.target.checked)}
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
                                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        placeholder="City, Country"
                                        className="pl-10"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Image URL</Label>
                                <div className="relative">
                                    <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => handleInputChange("image", e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="pl-10"
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
                                    <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Select
                                        value={formData.currency}
                                        onChange={(e) => handleInputChange("currency", e.target.value)}
                                        options={CURRENCY_OPTIONS}
                                        className="pl-10"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Goal Amount *</Label>
                                <div className="relative">
                                    <FiTarget className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="number"
                                        value={formData.goalAmount || ""}
                                        onChange={(e) => handleNumberInputChange("goalAmount", e.target.value)}
                                        placeholder="10000"
                                        min="0"
                                        step="0.01"
                                        className="pl-10"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Raised Amount</Label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="number"
                                        value={formData.raisedAmount || ""}
                                        onChange={(e) => handleNumberInputChange("raisedAmount", e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="pl-10"
                                        disabled={submitting}
                                    />
                                </div>
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
                                <Label>Beneficiaries</Label>
                                <div className="relative">
                                    <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="number"
                                        value={formData.beneficiaries || ""}
                                        onChange={(e) => handleNumberInputChange("beneficiaries", e.target.value)}
                                        placeholder="100"
                                        min="0"
                                        className="pl-10"
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Donors</Label>
                                <div className="relative">
                                    <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="number"
                                        value={formData.donors || ""}
                                        onChange={(e) => handleNumberInputChange("donors", e.target.value)}
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
                                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>End Date *</Label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                                        min={getMinEndDate()}
                                        className="pl-10"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>
                        </div>
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
                                    <span>{progress.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-blue-600 dark:text-blue-300">
                                    <span>{formData.currency} {formData.raisedAmount.toLocaleString()}</span>
                                    <span>{formData.currency} {formData.goalAmount.toLocaleString()}</span>
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
                            onClick={closeModal}
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
                            {submitting ? "Updating..." : "Update Campaign"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}