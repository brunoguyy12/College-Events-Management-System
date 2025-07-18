"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  QrCode,
  Camera,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  eventId: string;
  eventTitle: string;
}

interface ScannedRegistration {
  id: string;
  qrCode: string;
  checkedIn: boolean;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  event: {
    title: string;
    startDate: Date;
    venue: string;
  };
}

export function QRScanner({ eventId, eventTitle }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedRegistration | null>(
    null
  );
  const [manualCode, setManualCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const verifyRegistration = async (qrCode: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setScannedData(data.registration);
        toast({
          title: "Registration Verified",
          description: `${data.registration.user.name} has been checked in successfully.`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description:
            data.error || "Invalid QR code or registration not found.",
          variant: "destructive",
        });
        setScannedData(null);
      }
    } catch (error) {
      console.error("Error verifying registration:", error);
      toast({
        title: "Error",
        description: "Failed to verify registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = () => {
    if (manualCode.trim()) {
      verifyRegistration(manualCode.trim());
      setManualCode("");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner - {eventTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Section */}
          <div className="space-y-4">
            {!isScanning ? (
              <div className="text-center py-8">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Start camera to scan participant QR codes
                </p>
                <Button onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-lg border"
                    style={{ aspectRatio: "1/1" }}
                  />
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary"></div>
                  </div>
                </div>
                <div className="text-center">
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Manual Entry</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter QR code manually..."
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) =>
                  e.key === "Enter" && handleManualVerification()
                }
              />
              <Button
                onClick={handleManualVerification}
                disabled={!manualCode.trim() || isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Result */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scannedData.checkedIn ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Registration Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={scannedData.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {scannedData.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{scannedData.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {scannedData.user.email}
                </p>
              </div>
              <Badge
                variant={scannedData.checkedIn ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {scannedData.checkedIn ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    Checked In
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Not Checked In
                  </>
                )}
              </Badge>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>QR Code: {scannedData.qrCode}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Event: {scannedData.event.title}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Venue: {scannedData.event.venue}</span>
              </div>
            </div>

            {scannedData.checkedIn ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This participant has already been checked in for the event.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  This participant has not been checked in yet. The check-in has
                  been completed now.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
