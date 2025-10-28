import React from 'react';
import PropTypes from 'prop-types';

/**
 * OrderTimeline - Order status timeline visualization
 *
 * Features:
 * - Interactive timeline with status updates
 * - Time estimation
 * - Progress indicators
 * - Responsive design
 */
const OrderTimeline = ({ timeline = [], currentStatus = '' }) => {
  const getStatusIcon = (status, icon) => {
    const icons = {
      'preparing': icon || '👨‍🍳',
      'ready': icon || '✅',
      'picked_up': icon || '🚚',
      'delivering': icon || '📍',
      'delivered': icon || '🎉',
      'cancelled': icon || '❌'
    };
    return icons[status] || icon || '📋';
  };

  const getStatusColor = (status, completed) => {
    if (!completed) {
      return 'bg-gray-200 text-gray-400';
    }

    const colors = {
      'preparing': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'ready': 'bg-blue-100 text-blue-700 border-blue-300',
      'picked_up': 'bg-purple-100 text-purple-700 border-purple-300',
      'delivering': 'bg-green-100 text-green-700 border-green-300',
      'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'cancelled': 'bg-red-100 text-red-700 border-red-300'
    };

    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentStepIndex = () => {
    return timeline.findIndex(step => step.status === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Sipariş Durumu</h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 w-0.5 bg-green-500 transition-all duration-500"
            style={{
              height: `${Math.max(0, currentStepIndex * 100 / (timeline.length - 1))}%`
            }}
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-8">
          {timeline.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div
                key={step.id}
                className={`relative flex items-start ${
                  isCurrent ? 'transform scale-105' : ''
                } transition-all duration-300`}
              >
                {/* Status Icon */}
                <div
                  className={`
                    relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl
                    border-2 transition-all duration-300
                    ${getStatusColor(step.status, isCompleted)}
                    ${isCurrent ? 'ring-4 ring-opacity-20 ring-blue-400' : ''}
                    ${isUpcoming ? 'opacity-50' : ''}
                  `}
                >
                  {getStatusIcon(step.status, step.icon)}

                  {/* Pulsing effect for current step */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" />
                  )}
                </div>

                {/* Content */}
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${
                      isCompleted
                        ? 'text-gray-900'
                        : isCurrent
                          ? 'text-blue-600'
                          : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    {step.timestamp && (
                      <span className="text-sm text-gray-500">
                        {formatTime(step.timestamp)}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm ${
                    isCompleted
                      ? 'text-gray-600'
                      : isCurrent
                        ? 'text-blue-600'
                        : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>

                  {/* ETA for current step */}
                  {isCurrent && step.estimatedArrival && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Tahmini Varış:</strong> {step.estimatedArrival}
                      </p>
                    </div>
                  )}

                  {/* Additional info */}
                  {step.note && isCompleted && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">{step.note}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Summary */}
      {currentStatus && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Mevcut Durum</p>
              <p className="text-lg font-semibold text-blue-900">
                {timeline[currentStepIndex]?.title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Tahmini Süre</p>
              <p className="text-lg font-semibold text-blue-900">
                {currentStatus === 'delivered'
                  ? 'Tamamlandı'
                  : currentStatus === 'delivering'
                    ? '~45 dakika'
                    : '~2 saat'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Sipariş durumunuz hakkında SMS ile bilgilendirileceksiniz
        </p>
      </div>
    </div>
  );
};

OrderTimeline.propTypes = {
  timeline: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      completed: PropTypes.bool.isRequired,
      icon: PropTypes.string,
      estimatedArrival: PropTypes.string,
      note: PropTypes.string
    })
  ),
  currentStatus: PropTypes.string
};

export default OrderTimeline;