'use client'

import { useState, useEffect } from 'react'
import { Lock, Moon, Wifi, Plus, Minus, Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Notification {
  id: number;
  sender: string;
  amount: string;
  recipient: string;
}

function StatusBar() {
  return (
    <div className="flex justify-between text-white text-sm font-semibold px-6 py-2">
      <div>Starlink</div>
      <div className="flex items-center space-x-1">
        <Lock className="w-3 h-3" />
        <Moon className="w-3 h-3" />
        <span>69%</span>
      </div>
    </div>
  )
}

function TimeDisplay() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center text-white mt-8">
      <div className="text-8xl font-thin">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
      <div className="text-2xl mt-1">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  )
}

function StripeNotification({ notification, onEdit }: { notification: Notification; onEdit: (id: number) => void }) {
  return (
    <div className="bg-[rgba(0,0,0,0.6)] backdrop-blur-md rounded-2xl p-3 mb-2 relative group">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-[#635BFF] rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <span className="font-semibold text-white">{notification.sender}</span>
            <span className="text-gray-300 text-sm">2m ago</span>
          </div>
          <p className="text-white text-sm">
            You received a payment of {notification.amount} from {notification.recipient}
          </p>
        </div>
      </div>
      <button 
        onClick={() => onEdit(notification.id)} 
        className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit2 className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

function DoNotDisturbNotification() {
  return (
    <div className="bg-[rgba(0,0,0,0.6)] backdrop-blur-md rounded-2xl p-3">
      <div className="flex items-center">
        <div className="mr-3">
          <Moon className="text-white w-5 h-5" />
        </div>
        <div>
          <div className="font-semibold text-white">DO NOT DISTURB</div>
          <p className="text-white text-sm">
            Calls and notifications will be silenced while your iPhone is locked.
          </p>
        </div>
      </div>
    </div>
  )
}

function NotificationEditor({ notification, onSave, onClose }: { notification: Notification; onSave: (notification: Notification) => void; onClose: () => void }) {
  const [editedNotification, setEditedNotification] = useState(notification)

  const handleSave = () => {
    onSave(editedNotification)
    onClose()
  }

  return (
    <div className="space-y-4">
      <Input
        value={editedNotification.sender}
        onChange={(e) => setEditedNotification({ ...editedNotification, sender: e.target.value })}
        placeholder="Sender"
      />
      <Input
        value={editedNotification.amount}
        onChange={(e) => setEditedNotification({ ...editedNotification, amount: e.target.value })}
        placeholder="Amount"
      />
      <Input
        value={editedNotification.recipient}
        onChange={(e) => setEditedNotification({ ...editedNotification, recipient: e.target.value })}
        placeholder="Recipient"
      />
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

export function CustomizableIphoneLockScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, sender: 'Stripe', amount: '$4999.00', recipient: 'zuck@fb.com' },
    { id: 2, sender: 'Stripe', amount: '$4999.00', recipient: 'user@example.com' },
    { id: 3, sender: 'Stripe', amount: '$4999.00', recipient: 'another@example.com' },
  ])
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)

  const addNotification = () => {
    const newNotification: Notification = {
      id: Date.now(),
      sender: 'Stripe',
      amount: '$0.00',
      recipient: 'new@example.com',
    }
    setNotifications([...notifications, newNotification])
  }

  const removeNotification = () => {
    if (notifications.length > 0) {
      setNotifications(notifications.slice(0, -1))
    }
  }

  const editNotification = (id: number) => {
    const notificationToEdit = notifications.find(n => n.id === id)
    if (notificationToEdit) {
      setEditingNotification(notificationToEdit)
    }
  }

  const saveNotification = (editedNotification: Notification) => {
    setNotifications(notifications.map(n => n.id === editedNotification.id ? editedNotification : n))
    setEditingNotification(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm mx-auto h-[844px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-[60px] overflow-hidden shadow-2xl border-[14px] border-black relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl"></div>
        <StatusBar />
        <TimeDisplay />
        <div className="mt-8 px-4 space-y-2 max-h-[500px] overflow-y-auto">
          {notifications.map(notification => (
            <StripeNotification key={notification.id} notification={notification} onEdit={editNotification} />
          ))}
          <DoNotDisturbNotification />
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button onClick={addNotification}><Plus className="w-4 h-4 mr-2" /> Add Notification</Button>
        <Button onClick={removeNotification} variant="outline"><Minus className="w-4 h-4 mr-2" /> Remove Notification</Button>
      </div>
      <Dialog open={editingNotification !== null} onOpenChange={() => setEditingNotification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notification</DialogTitle>
          </DialogHeader>
          {editingNotification && (
            <NotificationEditor
              notification={editingNotification}
              onSave={saveNotification}
              onClose={() => setEditingNotification(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}