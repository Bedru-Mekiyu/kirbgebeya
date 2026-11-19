import { useState } from "react";
import { FiFileText, FiMessageSquare } from "react-icons/fi";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";

import campaignService from "@/services/campaignsService";
import type { Campaign, CampaignUpdate } from "@/services/campaignsService";
import toast from "react-hot-toast";

interface AddCampaignUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign & { updates?: CampaignUpdate[] };
  onUpdateAdded: () => void;
}

interface FormData {
  title: string;
  content: string;
  date: string;
}

export default function AddCampaignUpdateModal({
  isOpen,
  onClose,
  campaign,
  onUpdateAdded,
}: AddCampaignUpdateModalProps) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
    setError(null);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const validate = (): boolean => {
    if (!form.title.trim()) return setError("Title is required"), false;
    if (!form.content.trim()) return setError("Content is required"), false;
    if (!form.date) return setError("Date is required"), false;
    if (new Date(form.date) > new Date())
      return setError("Date cannot be in the future"), false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return toast.error("Please fix the errors");

    setSubmitting(true);
    setError(null);

    try {
      await campaignService.addCampaignUpdate({
        campaignId: campaign.id,
        title: form.title,
        content: form.content,
      });

      resetForm();
      onClose();
      onUpdateAdded();

      toast.success("Campaign update added!", {
        icon: "Checkmark",
        duration: 4000,
        position: "top-right",
      });
    } catch (e: any) {
      const msg = e.message ?? "Failed to add update";
      setError(msg);
      toast.error(msg, { duration: 5000, position: "top-right" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="m-4 max-w-[600px]"
      // This ensures the modal content is centered vertically
      overlayClassName="flex items-center justify-center"
    >
      <div className="rounded-3xl bg-white p-5 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <FiMessageSquare
              className="text-purple-600 dark:text-purple-400"
              size={18}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Add Campaign Update
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {campaign.title}
            </p>
          </div>
        </div>

        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Share progress, milestones, or updates.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Update Form */}
          <div className="space-y-3">
            <h3 className="border-b border-gray-200 pb-1.5 text-base font-semibold text-gray-800 dark:border-gray-700 dark:text-white/90">
              Update Details
            </h3>

            <div>
              <Label>Update Title *</Label>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Milestone reached"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <Label>Update Content *</Label>
              <TextArea
                value={form.content}
                onChange={(v) => handleChange("content", v)}
                placeholder="Describe the update..."
                rows={4}
                required
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Be clear and concise.
              </p>
            </div>
          </div>

          {/* Recent Updates (Compact) */}
          {campaign.updates?.length ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-white/90">
                <FiFileText size={14} />
                Recent Updates ({campaign.updates.length})
              </h4>
              <div className="max-h-24 space-y-1.5 overflow-y-auto text-xs">
                {campaign.updates.slice(0, 2).map((u) => (
                  <div
                    key={u.id}
                    className="border-l-2 border-purple-400 pl-2 text-gray-600 dark:text-gray-400"
                  >
                    <div className="font-medium">{u.title}</div>
                    <div className="text-[10px] opacity-75">
                      {new Date(u.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {campaign.updates.length > 2 && (
                  <div className="text-center text-[10px] text-gray-500 dark:text-gray-400">
                    +{campaign.updates.length - 2} more
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Buttons */}
          <div className="flex justify-end gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
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
              loading={submitting}
              disabled={submitting}
              className="min-w-[110px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-sm"
            >
              {submitting ? "Adding…" : "Add Update"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
