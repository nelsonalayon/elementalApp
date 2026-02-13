
'use client';
import { useParams } from 'next/navigation';
import { useApartmentsWithPayments } from '@/hooks/usePayments';
import { formatDate, formatCurrency, getNextPaymentDate, getPaymentsByPerson } from '@/utils/functions';
import { useEffect, useMemo } from 'react';

// Modern components
import StatCard from '@/components/StatCard';
import ProgressRing from '@/components/ProgressRing';
import PaymentTimeline from '@/components/PaymentTimeline';
import ApartmentDetails from '@/components/ApartmentDetails';
import ExampleChart from "@/components/graph";

// Icons
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Target,
  CreditCard,
  Home
} from 'lucide-react';

interface Payment {
    whomustpay?: string;
    downpaymentamount?: string;
    paymentDate: string;
    Paid: boolean;
}

export default function Apartments() {
    const params = useParams();
    const apartmentId = params.idapto as string;
    console.log({ apartmentId });

    const { apartments, loading, error } = useApartmentsWithPayments();
    
    const apartment = useMemo(() => 
        apartments.find(apt => apt.id.toString() === apartmentId),
        [apartments, apartmentId]
    );

    const calculations = useMemo(() => {
        if (!apartment) return {
            totalToPay: 0,
            paid: 0,
            pending: 0,
            overdue: 0,
            paymentsByPerson: [],
            nextPayment: null,
            completionPercentage: 0,
            averagePayment: 0,
            remainingMonths: 0,
            monthlyProgress: 0,
            statusCounts: { paid: 0, pending: 0, overdue: 0 }
        };

        const totalToPay = apartment.monthly?.reduce((sum, payment) => {
            return sum + parseFloat(payment.downpaymentamount || '0');
        }, 0) || 0;

        const paid = apartment.monthly?.reduce((sum, payment) => {
            if (payment.Paid) {
                return sum + parseFloat(payment.downpaymentamount || '0');
            }
            return sum;
        }, 0) || 0;

        const today = new Date();
        const overduePayments = apartment.monthly?.filter(payment => {
            const paymentDate = new Date(payment.paymentDate);
            return !payment.Paid && paymentDate < today;
        }) || [];

        const overdue = overduePayments.reduce((sum, payment) => {
            return sum + parseFloat(payment.downpaymentamount || '0');
        }, 0);

        const pending = totalToPay - paid;
        const paymentsByPerson = getPaymentsByPerson(apartment);
        const nextPayment = getNextPaymentDate(apartment);
        
        // New calculations
        const completionPercentage = totalToPay > 0 ? (paid / totalToPay) * 100 : 0;
        const apartmentCompletionPercentage = apartment.apartmentvalue ? (totalToPay / apartment.apartmentvalue) * 100 : 0;
        const averagePayment = apartment.monthly?.length ? totalToPay / apartment.monthly.length : 0;
        
        const paidCount = apartment.monthly?.filter(p => p.Paid).length || 0;
        const pendingCount = apartment.monthly?.filter(p => !p.Paid && new Date(p.paymentDate) >= today).length || 0;
        const overdueCount = overduePayments.length;

        // Calculate remaining months based on unpaid payments
        const unpaidPayments = apartment.monthly?.filter(p => !p.Paid) || [];
        const remainingMonths = unpaidPayments.length;
        
        // Monthly progress (payments made this month)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const thisMonthPayments = apartment.monthly?.filter(p => {
            const paymentDate = new Date(p.paymentDate);
            return p.Paid && paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        }) || [];
        const monthlyProgress = thisMonthPayments.reduce((sum, payment) => {
            return sum + parseFloat(payment.downpaymentamount || '0');
        }, 0);

        return {
            totalToPay,
            paid,
            pending,
            overdue,
            paymentsByPerson,
            nextPayment,
            completionPercentage,
            apartmentCompletionPercentage,
            averagePayment,
            remainingMonths,
            monthlyProgress,
            statusCounts: { paid: paidCount, pending: pendingCount, overdue: overdueCount }
        };
    }, [apartment]);

    useEffect(() => {
        console.log({ apartmentId, apartment, calculations });
    }, [apartmentId, apartment, calculations]);

    if (loading) return <div className="text-white p-4">Cargando apartamento...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!apartment) return <div className="text-white p-4">Apartamento no encontrado</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6 pt-20">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Home className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Apartamento {apartment.name || apartment.id}
                                </h1>
                                <p className="text-slate-300">
                                    Panel de control y gestión de pagos
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-slate-400">Estado del proyecto</div>
                            <div className={`text-lg font-semibold ${
                                (calculations.completionPercentage || 0) >= 100 ? 'text-emerald-400' :
                                (calculations.completionPercentage || 0) >= 50 ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                                {(calculations.completionPercentage || 0) >= 100 ? 'Completado' :
                                (calculations.completionPercentage || 0) >= 50 ? 'En progreso' : 'Iniciando'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Valor Total del Apartamento"
                        value={formatCurrency(apartment.apartmentvalue || 0)}
                        icon={<Home className="w-5 h-5" />}
                        color="purple"
                    />
                    <StatCard
                        title="Total en Cuotas"
                        value={formatCurrency(calculations.totalToPay)}
                        icon={<Target className="w-5 h-5" />}
                        change={`${(calculations.apartmentCompletionPercentage || 0).toFixed(1)}% del valor total`}
                        changeType="neutral"
                        color="blue"
                    />
                    <StatCard
                        title="Pagado"
                        value={formatCurrency(calculations.paid)}
                        icon={<CheckCircle className="w-5 h-5" />}
                        change={`${(calculations.completionPercentage || 0).toFixed(1)}% completado`}
                        changeType="positive"
                        color="green"
                    />
                    <StatCard
                        title="Pendiente"
                        value={formatCurrency(calculations.pending)}
                        icon={<Clock className="w-5 h-5" />}
                        change={`${calculations.remainingMonths} cuotas restantes`}
                        changeType="neutral"
                        color="yellow"
                    />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Cuotas Vencidas"
                        value={formatCurrency(calculations.overdue)}
                        icon={<AlertTriangle className="w-5 h-5" />}
                        change={`${calculations.statusCounts.overdue} cuotas`}
                        changeType={calculations.overdue > 0 ? "negative" : "positive"}
                        color="red"
                    />
                    <StatCard
                        title="Promedio por Cuota"
                        value={formatCurrency(calculations.averagePayment)}
                        icon={<CreditCard className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Progreso este Mes"
                        value={formatCurrency(calculations.monthlyProgress)}
                        icon={<TrendingUp className="w-5 h-5" />}
                        changeType="positive"
                        color="green"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress and Chart Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Ring and Chart */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Progress Ring */}
                            <div className="bg-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                    <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                                    Progreso de Pagos
                                </h3>
                                <div className="flex items-center justify-center">
                                    <ProgressRing 
                                        percentage={calculations.completionPercentage || 0}
                                        size={140}
                                        strokeWidth={12}
                                        color="#10b981"
                                    >
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">
                                                {Math.round(calculations.completionPercentage || 0)}%
                                            </div>
                                            <div className="text-xs text-slate-400">
                                                Completado
                                            </div>
                                        </div>
                                    </ProgressRing>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="text-sm text-slate-300">
                                        {formatCurrency(calculations.paid)} de {formatCurrency(calculations.totalToPay)}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {calculations.statusCounts.paid} de {calculations.statusCounts.paid + calculations.statusCounts.pending + calculations.statusCounts.overdue} cuotas
                                    </div>
                                </div>
                            </div>

                            {/* Next Payment Info */}
                            <div className="bg-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                    <Calendar className="w-5 h-5 text-yellow-400 mr-2" />
                                    Próxima Cuota
                                </h3>
                                
                                {calculations.nextPayment ? (
                                    <div className="space-y-4">
                                        <div className="bg-slate-700/50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-300">Responsable</span>
                                                <span className="text-white font-medium">
                                                    {calculations.nextPayment.whomustpay || 'Sin asignar'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-300">Monto</span>
                                                <span className="text-emerald-400 font-semibold">
                                                    {formatCurrency(parseFloat(calculations.nextPayment.downpaymentamount || '0'))}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300">Fecha límite</span>
                                                <span className="text-yellow-400 font-medium">
                                                    {formatDate(new Date(calculations.nextPayment.paymentDate))}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Days until payment */}
                                        {(() => {
                                            const today = new Date();
                                            const paymentDate = new Date(calculations.nextPayment.paymentDate);
                                            const diffTime = paymentDate.getTime() - today.getTime();
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            
                                            return (
                                                <div className={`text-center p-3 rounded-lg ${
                                                    diffDays < 0 ? 'bg-red-500/20 border border-red-500/30' :
                                                    diffDays <= 7 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                                    'bg-green-500/20 border border-green-500/30'
                                                }`}>
                                                    <div className={`text-2xl font-bold ${
                                                        diffDays < 0 ? 'text-red-400' :
                                                        diffDays <= 7 ? 'text-yellow-400' :
                                                        'text-green-400'
                                                    }`}>
                                                        {Math.abs(diffDays)}
                                                    </div>
                                                    <div className={`text-sm ${
                                                        diffDays < 0 ? 'text-red-300' :
                                                        diffDays <= 7 ? 'text-yellow-300' :
                                                        'text-green-300'
                                                    }`}>
                                                        {diffDays < 0 ? 'días vencido' :
                                                        diffDays === 0 ? 'vence hoy' :
                                                        diffDays === 1 ? 'día restante' : 'días restantes'}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                                        <p className="text-emerald-400 font-medium">¡Todos los pagos completados!</p>
                                        <p className="text-slate-400 text-sm">No hay más cuotas pendientes</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Chart */}
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
                                Distribución de Pagos
                            </h3>
                            <ExampleChart 
                                total={apartment.apartmentvalue || 0} 
                                paid={calculations.paid} 
                                initialQuota={calculations.totalToPay} 
                            />
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Apartment Details */}
                        <ApartmentDetails apartment={apartment} />

                        {/* Payment Timeline */}
                        {apartment.monthly && apartment.monthly.length > 0 && (
                            <PaymentTimeline payments={apartment.monthly} />
                        )}

                        {/* People Payments Summary */}
                        {calculations.paymentsByPerson && calculations.paymentsByPerson.length > 0 && (
                            <div className="bg-slate-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                                    <Users className="w-5 h-5 text-purple-400 mr-2" />
                                    Resumen por Persona
                                </h3>
                                <div className="space-y-3">
                                    {calculations.paymentsByPerson.map((person, index) => (
                                        <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-white font-medium">{person.name}</h4>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    person.pendingAmount > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                    {person.pendingAmount > 0 ? 'Pendiente' : 'Al día'}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm">Monto pendiente</span>
                                                <span className={`font-semibold ${
                                                    person.pendingAmount > 0 ? 'text-red-400' : 'text-green-400'
                                                }`}>
                                                    {formatCurrency(person.pendingAmount)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}