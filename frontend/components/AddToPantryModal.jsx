/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Camera, Plus, X, Edit2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "@/components/ImageUploader";
import useFetch from "@/hooks/use-fetch";
import {
  scanPantryImage,
  saveToPantry,
  addPantryItemManually,
} from "@/actions/pantry.actions";
import { toast } from "sonner";

export default function AddToPantryModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", quantity: "" });
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

  // Scan image
  const {
    loading: scanning,
    data: scanData,
    fn: scanImage,
  } = useFetch(scanPantryImage);

  // Save scanned items
  const {
    loading: saving,
    data: saveData,
    fn: saveScannedItems,
  } = useFetch(saveToPantry);

  // Add manual item
  const {
    loading: adding,
    data: addData,
    fn: addManualItem,
  } = useFetch(addPantryItemManually);

  // Handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]); // Reset when new image selected
  };

  // Scan image
  const handleScan = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    await scanImage(formData);
  };

  // Update scanned ingredients when scan completes
  useEffect(() => {
    if (scanData?.success && scanData?.ingredients) {
      setScannedIngredients(scanData.ingredients);
      toast.success(`Found ${scanData.ingredients.length} ingredients!`);
    }
  }, [scanData]);

  // Handle save scanned items
  const handleSaveScanned = async () => {
    if (scannedIngredients.length === 0) {
      toast.error("No ingredients to save");
      return;
    }

    const formData = new FormData();
    formData.append("ingredients", JSON.stringify(scannedIngredients));
    await saveScannedItems(formData);
  };

  // Reset modal state
  const handleClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setEditingIndex(null);
    setEditValues({ name: "", quantity: "" });
    setManualItem({ name: "", quantity: "" });
    onClose();
  };

  // Handle save success
  useEffect(() => {
    if (saveData?.success) {
      toast.success(saveData.message);
      handleClose();
      if (onSuccess) onSuccess();
    }
  }, [saveData]);

  // Handle manual add
  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", manualItem.name);
    formData.append("quantity", manualItem.quantity);
    await addManualItem(formData);
  };

  // Handle manual add success
  useEffect(() => {
    if (addData?.success) {
      toast.success("Item added to pantry!");
      setManualItem({ name: "", quantity: "" });
      handleClose();
      if (onSuccess) onSuccess();
    }
  }, [addData]);

  // Remove scanned ingredient
  const removeIngredient = (index) => {
    setScannedIngredients(scannedIngredients.filter((_, i) => i !== index));
  };

  // Start editing scanned ingredient
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditValues({
      name: scannedIngredients[index].name,
      quantity: scannedIngredients[index].quantity,
    });
  };

  // Save edit
  const saveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...scannedIngredients];
      updated[editingIndex] = {
        ...updated[editingIndex],
        name: editValues.name,
        quantity: editValues.quantity,
      };
      setScannedIngredients(updated);
      setEditingIndex(null);
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValues({ name: "", quantity: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add to Pantry
          </DialogTitle>
          <DialogDescription>
            Scan your pantry with AI or add items manually
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan" className="gap-2">
              <Camera className="w-4 h-4" />
              AI Scan
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Manually
            </TabsTrigger>
          </TabsList>

          {/* AI Scan Tab */}
          <TabsContent value="scan" className="space-y-6 mt-6">
            {scannedIngredients.length === 0 ? (
              // Step 1: Upload & Scan
              <div className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  loading={scanning}
                />

                {selectedImage && !scanning && (
                  <Button
                    onClick={handleScan}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg"
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Scan Image
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              // Step 2: Review & Save
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      Review Detected Items
                    </h3>
                    <p className="text-sm text-stone-600">
                      Found {scannedIngredients.length} ingredients
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScannedIngredients([]);
                      setSelectedImage(null);
                    }}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Scan Again
                  </Button>
                </div>

                {/* Ingredients List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {scannedIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200"
                    >
                      {editingIndex === index ? (
                        // Edit Mode
                        <>
                          <div className="flex-1 flex gap-3">
                            <input
                              type="text"
                              value={editValues.name}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  name: e.target.value,
                                })
                              }
                              className="flex-1 px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Ingredient name"
                            />
                            <input
                              type="text"
                              value={editValues.quantity}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  quantity: e.target.value,
                                })
                              }
                              className="w-32 px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Quantity"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={saveEdit}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex-1">
                            <div className="font-medium text-stone-900">
                              {ingredient.name}
                            </div>
                            <div className="text-sm text-stone-500">
                              {ingredient.quantity}
                            </div>
                          </div>
                          {ingredient.confidence && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-700 border-green-200"
                            >
                              {Math.round(ingredient.confidence * 100)}%
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(index)}
                            className="text-stone-600 hover:text-orange-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeIngredient(index)}
                            className="text-stone-600 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSaveScanned}
                    disabled={saving || scannedIngredients.length === 0}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Save {scannedIngredients.length} Items to Pantry
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-stone-300"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Manual Add Tab */}
          <TabsContent value="manual" className="mt-6">
            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  value={manualItem.name}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, name: e.target.value })
                  }
                  placeholder="e.g., Chicken breast"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={adding}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={manualItem.quantity}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, quantity: e.target.value })
                  }
                  placeholder="e.g., 500g, 2 cups, 3 pieces"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={adding}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12"
                >
                  {adding ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Item
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-stone-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
