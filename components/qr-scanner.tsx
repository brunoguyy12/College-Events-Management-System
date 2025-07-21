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
  ExternalLink, 
  Scan
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsQR from "jsqr"


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
  const [scanningStatus, setScanningStatus] = useState<string>("Ready to scan")
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setScanningStatus("Camera started - Point at QR code")

        // Start QR detection
        videoRef.current.onloadedmetadata = () => {
          startQRDetection()
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
      setScanningStatus("Camera access denied")
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsScanning(false);
    setScanningStatus("Camera stopped");
  };

  const startQRDetection = () => {
    const detectQR = () => {
      if (videoRef.current && canvasRef.current && isScanning) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)

          if (code) {
            setScanningStatus("QR Code detected!")
            handleQRCodeDetection(code.data)
            return // Stop scanning after successful detection
          } else {
            setScanningStatus("Scanning for QR code...")
          }
        }

        animationRef.current = requestAnimationFrame(detectQR)
      }
    }

    detectQR()
  }

  const verifyRegistration = async (qrCode: string) => {
    setIsLoading(true);
    setScanningStatus("Verifying registration...")

    try {
      const response = await fetch(`/api/events/${eventId}/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setScannedData(data.registration);
        setScanningStatus("Registration verified successfully!")
        toast({
          title: "Registration Verified",
          description: `${data.registration.user.name} has been checked in successfully.`,
        });
        
        // Stop camera after successful scan
        stopCamera()
      } else {
        toast({
          title: "Verification Failed",
          description:
            data.error || "Invalid QR code or registration not found.",
          variant: "destructive",
        });
        setScannedData(null);
        setScanningStatus("Verification failed - Continue scanning")
      }
    } catch (error) {
      console.error("Error verifying registration:", error);
      toast({
        title: "Error",
        description: "Failed to verify registration. Please try again.",
        variant: "destructive",
      });
      setScanningStatus("Error occurred - Continue scanning")
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = () => {
    if (manualCode.trim()) {
      // Check if it's a URL (from QR code) or just the code
      if (manualCode.includes("/check-in?verify=")) {
        try {
        const url = new URL(manualCode)
        const qrCode = url.searchParams.get("verify")
        if (qrCode) {
          verifyRegistration(qrCode)
        }
        } catch (error) {
          // If URL parsing fails, treat as direct code
          verifyRegistration(manualCode.trim())
        }
      } else {
        verifyRegistration(manualCode.trim());
      }
      setManualCode("");
    }
  };

  const handleQRCodeDetection = (qrText: string) => {
    // Handle both URL format and direct code format
    if (qrText.includes("/check-in?verify=")) {
      try {
        const url = new URL(qrText)
        const qrCode = url.searchParams.get("verify")
        if (qrCode) {
          verifyRegistration(qrCode)
        }
      } catch (error) {
        console.error("Invalid QR URL:", error)
        toast({
          title: "Invalid QR Code",
          description: "The scanned QR code is not valid.",
          variant: "destructive",
        })
        setScanningStatus("Invalid QR code - Continue scanning")
      }
    } else {
      verifyRegistration(qrText)
    }
  }

  const resetScanner = () => {
    setScannedData(null)
    setScanningStatus("Ready to scan")
    if (!isScanning) {
      startCamera()
    }
  }

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
          {/* Status Display */}
          <div className="text-center">
            <Badge variant={isScanning ? "default" : "secondary"} className="mb-2">
              <Scan className="h-3 w-3 mr-1" />
              {scanningStatus}
            </Badge>
          </div>

          {/* Camera Section */}
          <div className="space-y-4">
            {!isScanning ? (
              <div className="text-center py-8">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Start camera to scan participant QR codes
                </p>
                <Button onClick={startCamera} disabled={isLoading}>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative  mx-auto max-w-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg border"
                    style={{ aspectRatio: "4/3" }}
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Scanning overlay */}
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary"></div>
                  </div>

                  {/* Scanning line animation */}
                    <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary opacity-75 animate-pulse"></div>
                </div>
                <div className="text-center space-y-2">
                  <Button onClick={stopCamera} variant="outline">
                    Stop Camera
                  </Button>
                  {scannedData && (
                    <Button onClick={resetScanner} variant="secondary">
                      Scan Another
                    </Button>
                  )}
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
                placeholder="Enter QR code or URL manually..."
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
            <p className="text-xs text-muted-foreground mt-1">
              You can paste the full check-in URL or just the verification code
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Scanned Result */}
      {scannedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              
                <CheckCircle className="h-5 w-5 text-green-500" />
              Registration Verified
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
                variant="default"
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                    Checked In
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

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Participant has been successfully checked in for the event.</AlertDescription>
            </Alert>


            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const checkInUrl = `${window.location.origin}/events/${eventId}/check-in?verify=${scannedData.qrCode}`
                  window.open(checkInUrl, "_blank")
                }}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Check-in Page
              </Button>
              <Button onClick={resetScanner} size="sm">
                Scan Next Participant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
