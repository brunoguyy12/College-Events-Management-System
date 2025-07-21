import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Calendar, MapPin, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

interface CheckInContentProps {
  eventId: string
  qrCode: string
}

export async function CheckInContent({ eventId, qrCode }: CheckInContentProps) {
  // Find the registration
  const registration = await db.registration.findFirst({
    where: {
      eventId,
      qrCode,
    },
    include: {
      user: true,
      event: true,
    },
  })

  if (!registration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Invalid Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Registration not found or QR code is invalid.</p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const now = new Date()
  const eventStart = new Date(registration.event.startDate)
  const eventEnd = new Date(registration.event.endDate)
  const isEventTime = now >= eventStart && now <= eventEnd
  const isBeforeEvent = now < eventStart
  const isAfterEvent = now > eventEnd

  // Determine check-in status and action
  let checkInStatus: "early" | "ontime" | "late" | "already" = "ontime"
  let shouldUpdateCheckIn = false

  if (registration.checkedIn) {
    checkInStatus = "already"
  } else if (isBeforeEvent) {
    checkInStatus = "early"
    shouldUpdateCheckIn = true // Allow early check-in
  } else if (isAfterEvent) {
    checkInStatus = "late"
    shouldUpdateCheckIn = true // Allow late check-in
  } else {
    checkInStatus = "ontime"
    shouldUpdateCheckIn = true
  }

  // Update check-in status if needed
  if (shouldUpdateCheckIn && !registration.checkedIn) {
    await db.registration.update({
      where: { id: registration.id },
      data: { checkedIn: true },
    })
  }

  const getStatusMessage = () => {
    switch (checkInStatus) {
      case "early":
        return {
          title: "Early Check-in Successful!",
          description: "You've checked in early. Please arrive on time for the event.",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      case "ontime":
        return {
          title: "Check-in Successful!",
          description: "Welcome to the event! You're all set.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "late":
        return {
          title: "Late Check-in Successful!",
          description: "You've checked in after the event started. Please proceed quickly.",
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        }
      case "already":
        return {
          title: "Already Checked In",
          description: "You have already been checked in for this event.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${statusInfo.color}`}>
            <CheckCircle className="h-6 w-6" />
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Message */}
          <div className="text-center">
            <div
              className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <CheckCircle className={`h-8 w-8 ${statusInfo.color}`} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome to {registration.event.title}!</h2>
            <p className="text-muted-foreground">{statusInfo.description}</p>
          </div>

          {/* Event Timing Info */}
          <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Event Timing</span>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Start:</span>{" "}
                {new Date(registration.event.startDate).toLocaleString()}
              </p>
              <p>
                <span className="text-muted-foreground">End:</span>{" "}
                {new Date(registration.event.endDate).toLocaleString()}
              </p>
              <p>
                <span className="text-muted-foreground">Current:</span> {now.toLocaleString()}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{registration.user.name || registration.user.email}</p>
                <p className="text-sm text-muted-foreground">{registration.user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(registration.event.startDate).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{registration.event.venue}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <Badge variant="default" className={`${statusInfo.bgColor} ${statusInfo.color} border-current`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Checked In
              {isBeforeEvent && " (Early)"}
              {isAfterEvent && " (Late)"}
            </Badge>
          </div>

          {/* Timing Alerts */}
          {isBeforeEvent && (
            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                You've checked in early! The event starts at {new Date(registration.event.startDate).toLocaleString()}.
                Please arrive on time.
              </AlertDescription>
            </Alert>
          )}

          {isAfterEvent && (
            <Alert className="border-orange-200 bg-orange-50">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                The event has already ended. This is a late check-in for record purposes.
              </AlertDescription>
            </Alert>
          )}

          {checkInStatus === "already" && (
            <Alert className="border-gray-200 bg-gray-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>You have already been checked in for this event previously.</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={`/events/${registration.event.id}`}>View Event Details</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Registration ID: {registration.qrCode}</p>
            <p>Checked in at: {new Date().toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
