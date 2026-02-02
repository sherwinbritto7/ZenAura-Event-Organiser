"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, MapPin } from "lucide-react";
import { City, State } from "country-state-city";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CATEGORIES } from "@/lib/data";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

export function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India",
  });

  const { mutate: completeOnboarding, isLoading } = useConvexMutation(
    api.users.completeOnboarding,
  );

  const progress = (step / 2) * 100;

  /* -------------------- Location helpers -------------------- */
  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if (!location.state) return [];
    const selectedState = indianStates.find((s) => s.name === location.state);
    if (!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode);
  }, [location.state, indianStates]);

  /* -------------------- Reset on close -------------------- */
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedInterests([]);
      setLocation({ state: "", city: "", country: "India" });
    }
  }, [isOpen]);

  /* -------------------- Handlers -------------------- */
  const toggleInterest = (categoryId) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding({
        location,
        interests: selectedInterests,
      });
      toast.success("Welcome to 🪷 ZenAura!");
      onComplete();
    } catch (error) {
      toast.error("Failed to complete onboarding");
      console.error(error);
    }
  };

  const handleNext = () => {
    if (isLoading) return;

    if (step === 1 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }

    if (step === 2 && (!location.state || !location.city)) {
      toast.error("Please select both state and city");
      return;
    }

    if (step < 2) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <Progress value={progress} className="h-1 mb-2" />

          <DialogTitle className="flex items-center gap-2 text-2xl">
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interests you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>

          <DialogDescription>
            {step === 1
              ? "Select at least 3 categories to personalize your experience."
              : "We'll show you events happening near you."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* -------- STEP 1 -------- */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto p-2 no-scrollbar">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedInterests.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterests.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterests.length} selected
                </Badge>

                {selectedInterests.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to continue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* -------- STEP 2 -------- */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select
                    value={location.state}
                    onValueChange={(value) =>
                      setLocation({ ...location, state: value, city: "" })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state.isoCode} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select
                    value={location.city}
                    onValueChange={(value) =>
                      setLocation({ ...location, city: value })
                    }
                    disabled={!location.state}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          location.state ? "Select city" : "Select state first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {location.city && location.state && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Your Location</p>
                      <p className="text-sm text-muted-foreground">
                        {location.city}, {location.state}, {location.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          <Button
            className="flex-1 gap-2"
            disabled={isLoading}
            onClick={handleNext}
          >
            {isLoading
              ? "Completing..."
              : step === 2
                ? "Complete Setup"
                : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
